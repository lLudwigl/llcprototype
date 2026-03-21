/**
 * fetch-wl-data.ts
 * Fetches all Wiener Linien lines and stops from the official OGD CSV files
 * and generates SQL seed files for the Schwarzkappler database.
 *
 * Run with: pnpm fetch-wl-data
 *
 * Output:
 *   supabase/migrations/002_seed_lines.sql     (replaced with real data)
 *   supabase/migrations/003_seed_stations.sql
 *   supabase/migrations/004_seed_directions.sql
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');

// ── Wiener Linien OGD CSV URLs ────────────────────────────────────────────────

const URLS = {
  lines:    'https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-linien.csv',
  stops:    'https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-haltepunkte.csv',
  routes:   'https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-fahrwegverlaeufe.csv',
};

// ── Types ─────────────────────────────────────────────────────────────────────

type DbLineType = 'ubahn' | 'tram' | 'bus' | 'sbahn';

interface WlLine {
  lineId: string;
  lineText: string;    // "U4", "13A", "N25" — used as lines.id in DB
  type: DbLineType;
}

interface WlStop {
  stopId: string;
  stopText: string;
}

interface RouteEntry {
  lineId: string;
  patternId: string;
  seqCount: number;
  stopId: string;
  direction: string;  // "1" or "2"
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Escape single quotes for SQL string literals. */
function sq(s: string): string {
  return s.replace(/'/g, "''");
}

/** Parse a semicolon-delimited CSV string into an array of row objects. */
function parseCsv(raw: string): Record<string, string>[] {
  const lines = raw.trim().split('\n').map((l) => l.trim());
  const headers = lines[0]!.split(';');
  return lines.slice(1).map((line) => {
    const values = line.split(';');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

/** Fetch a URL and return the response body as UTF-8 text. */
async function fetchText(url: string): Promise<string> {
  console.log(`  Fetching ${url.split('/').pop()}…`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const buf = await res.arrayBuffer();
  // Wiener Linien CSVs are UTF-8; TextDecoder handles special chars correctly
  return new TextDecoder('utf-8').decode(buf);
}

// ── Transport type mapping ────────────────────────────────────────────────────

const TRANSPORT_TYPE: Record<string, DbLineType> = {
  ptMetro:    'ubahn',
  ptTram:     'tram',
  ptTramWLB:  'tram',   // Wiener Lokalbahn (WLB) — operates like a tram
  ptBusCity:  'bus',    // regular city buses (13A, 14A, 1A, 2A…)
  ptBusNight: 'bus',    // night buses (N6, N25…)
  ptTrainS:   'sbahn',
  // ptRufBus (on-demand Rufbusse) intentionally excluded — no scheduled stops
};

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {

  console.log('\n[ SCHWARZKAPPLER ] Wiener Linien OGD data fetcher\n');

  // ── Step 1: Fetch all three CSV files ──────────────────────────────────────

  console.log('Fetching CSV files…');
  const [linesCsv, stopsCsv, routesCsv] = await Promise.all([
    fetchText(URLS.lines),
    fetchText(URLS.stops),
    fetchText(URLS.routes),
  ]);
  console.log('  All files received.\n');

  // ── Step 2: Parse lines ────────────────────────────────────────────────────

  const wlLines: WlLine[] = [];
  const lineById = new Map<string, WlLine>();  // numeric lineId → WlLine

  for (const row of parseCsv(linesCsv)) {
    const transport = row['MeansOfTransport'] ?? '';
    const type = TRANSPORT_TYPE[transport];
    if (type === undefined) continue;   // skip unknown transport types

    const line: WlLine = {
      lineId:   row['LineID'] ?? '',
      lineText: row['LineText'] ?? '',
      type,
    };
    wlLines.push(line);
    lineById.set(line.lineId, line);
  }

  console.log(`Parsed ${wlLines.length} lines.`);

  // ── Step 3: Parse stop names ───────────────────────────────────────────────

  const stopById = new Map<string, string>();  // stopId → stopText

  for (const row of parseCsv(stopsCsv)) {
    const stopId = row['StopID'] ?? '';
    const stopText = (row['StopText'] ?? '').trim();
    // Skip stops with empty names — a handful exist in the official data with no StopText
    if (stopId && stopText.length > 0) stopById.set(stopId, stopText);
  }

  console.log(`Parsed ${stopById.size} stops.\n`);

  // ── Step 4: Parse route sequences ─────────────────────────────────────────

  // structure: lineId → patternId → direction → RouteEntry[]
  const routeMap = new Map<string, Map<string, Map<string, RouteEntry[]>>>();

  for (const row of parseCsv(routesCsv)) {
    const lineId    = row['LineID']      ?? '';
    const patternId = row['PatternID']   ?? '';
    const direction = row['Direction']   ?? '';
    const stopId    = row['StopID']      ?? '';
    const seqRaw    = row['StopSeqCount'] ?? '';

    if (!lineId || !patternId || !stopId || !seqRaw) continue;
    if (!lineById.has(lineId)) continue;  // skip lines we don't recognise

    const seqCount = parseInt(seqRaw, 10);

    if (!routeMap.has(lineId)) routeMap.set(lineId, new Map());
    const byPattern = routeMap.get(lineId)!;

    if (!byPattern.has(patternId)) byPattern.set(patternId, new Map());
    const byDirection = byPattern.get(patternId)!;

    if (!byDirection.has(direction)) byDirection.set(direction, []);
    byDirection.get(direction)!.push({ lineId, patternId, direction, seqCount, stopId });
  }

  // ── Step 5: For each line, select the canonical pattern ───────────────────
  // Canonical = direction "1" pattern with the most stops (fullest route).

  interface CanonicalRoute {
    dir1: RouteEntry[];   // forward direction, sorted
    dir2: RouteEntry[];   // reverse direction, sorted
  }

  const canonicalRoutes = new Map<string, CanonicalRoute>();

  for (const [lineId, byPattern] of routeMap) {
    let bestDir1: RouteEntry[] = [];
    let bestDir2: RouteEntry[] = [];

    for (const [, byDirection] of byPattern) {
      const d1 = (byDirection.get('1') ?? []).sort((a, b) => a.seqCount - b.seqCount);
      const d2 = (byDirection.get('2') ?? []).sort((a, b) => a.seqCount - b.seqCount);
      if (d1.length > bestDir1.length) { bestDir1 = d1; bestDir2 = d2; }
    }

    if (bestDir1.length > 0) {
      canonicalRoutes.set(lineId, { dir1: bestDir1, dir2: bestDir2 });
    }
  }

  // ── Step 6: Generate SQL ───────────────────────────────────────────────────

  console.log('Generating SQL files…\n');

  // ── 002_seed_lines.sql ─────────────────────────────────────────────────────

  const lines002: string[] = [
    `-- ============================================================`,
    `-- 002_seed_lines.sql`,
    `-- All Wiener Linien lines — auto-generated by scripts/fetch-wl-data.ts`,
    `-- Source: Wiener Linien OGD (wienerlinien-ogd-linien.csv)`,
    `-- Safe to re-run: ON CONFLICT (id) DO NOTHING`,
    `-- ============================================================`,
    ``,
    `INSERT INTO lines (id, name, type) VALUES`,
  ];

  const lineValues = wlLines.map((l, i) => {
    const comma = i < wlLines.length - 1 ? ',' : ';';
    return `  ('${sq(l.lineText)}', 'Linie ${sq(l.lineText)}', '${l.type}')${comma}`;
  });
  lines002.push(...lineValues);
  lines002.push(`ON CONFLICT (id) DO NOTHING`);

  // Wait — ON CONFLICT must come before the trailing semicolon.
  // Rebuild properly:
  const lineInserts002: string[] = [
    `-- ============================================================`,
    `-- 002_seed_lines.sql`,
    `-- All Wiener Linien lines — auto-generated by scripts/fetch-wl-data.ts`,
    `-- Source: Wiener Linien OGD (wienerlinien-ogd-linien.csv)`,
    `-- Safe to re-run: ON CONFLICT (id) DO NOTHING`,
    `-- ============================================================`,
    ``,
  ];

  // Group by type for readability
  const byType = new Map<DbLineType, WlLine[]>();
  for (const l of wlLines) {
    if (!byType.has(l.type)) byType.set(l.type, []);
    byType.get(l.type)!.push(l);
  }

  const typeOrder: DbLineType[] = ['ubahn', 'sbahn', 'tram', 'bus'];
  const typeLabels: Record<DbLineType, string> = {
    ubahn: 'U-Bahn',
    sbahn: 'S-Bahn',
    tram:  'Tram (Straßenbahn)',
    bus:   'Bus (inkl. Nachtbus)',
  };

  for (const type of typeOrder) {
    const group = byType.get(type);
    if (!group || group.length === 0) continue;

    lineInserts002.push(`-- ── ${typeLabels[type]} ${'─'.repeat(40 - typeLabels[type].length)}`);
    lineInserts002.push(`INSERT INTO lines (id, name, type) VALUES`);
    group.forEach((l, i) => {
      const comma = i < group.length - 1 ? ',' : '';
      lineInserts002.push(`  ('${sq(l.lineText)}', 'Linie ${sq(l.lineText)}', '${l.type}')${comma}`);
    });
    lineInserts002.push(`ON CONFLICT (id) DO NOTHING;`);
    lineInserts002.push('');
  }

  writeFileSync(
    join(MIGRATIONS, '002_seed_lines.sql'),
    lineInserts002.join('\n'),
    'utf-8',
  );
  console.log(`  ✓ 002_seed_lines.sql  (${wlLines.length} lines)`);

  // ── 003_seed_stations.sql ──────────────────────────────────────────────────

  const lines003: string[] = [
    `-- ============================================================`,
    `-- 003_seed_stations.sql`,
    `-- All Wiener Linien stops per line — auto-generated by scripts/fetch-wl-data.ts`,
    `-- Source: Wiener Linien OGD (haltepunkte.csv + fahrwegverlaeufe.csv)`,
    `-- Uses direction 1 (canonical forward direction) for stop_order.`,
    `-- Each station appears once per line it serves.`,
    `-- ============================================================`,
    ``,
    `-- Add unique constraint to make ON CONFLICT work on subsequent runs.`,
    `-- Safe to run even if constraint already exists.`,
    `DO $$ BEGIN`,
    `  IF NOT EXISTS (`,
    `    SELECT 1 FROM pg_constraint WHERE conname = 'stations_line_order_unique'`,
    `  ) THEN`,
    `    ALTER TABLE stations ADD CONSTRAINT stations_line_order_unique`,
    `      UNIQUE (line_id, stop_order);`,
    `  END IF;`,
    `END $$;`,
    ``,
  ];

  let stationRowCount = 0;

  for (const type of typeOrder) {
    const group = byType.get(type);
    if (!group || group.length === 0) continue;

    lines003.push(`-- ── ${typeLabels[type]} ${'─'.repeat(40 - typeLabels[type].length)}`);

    for (const line of group) {
      const route = canonicalRoutes.get(line.lineId);
      if (!route || route.dir1.length === 0) continue;

      lines003.push(`-- ${line.lineText}`);
      // Skip stops with no known name (a few exist in the official data)
      const namedEntries = route.dir1.filter((e) => stopById.has(e.stopId));
      if (namedEntries.length === 0) continue;

      lines003.push(`INSERT INTO stations (name, line_id, stop_order) VALUES`);

      namedEntries.forEach((entry, i) => {
        const stopName = stopById.get(entry.stopId)!;
        const comma = i < namedEntries.length - 1 ? ',' : '';
        lines003.push(`  ('${sq(stopName)}', '${sq(line.lineText)}', ${i + 1})${comma}`);
        stationRowCount++;
      });

      lines003.push(`ON CONFLICT (line_id, stop_order) DO NOTHING;`);
      lines003.push('');
    }
  }

  writeFileSync(
    join(MIGRATIONS, '003_seed_stations.sql'),
    lines003.join('\n'),
    'utf-8',
  );
  console.log(`  ✓ 003_seed_stations.sql  (${stationRowCount} station rows)`);

  // ── 004_seed_directions.sql ────────────────────────────────────────────────

  const lines004: string[] = [
    `-- ============================================================`,
    `-- 004_seed_directions.sql`,
    `-- Creates the line_directions table and seeds terminus stations.`,
    `-- terminus_first = first stop in direction 1 (canonical forward)`,
    `-- terminus_last  = last stop in direction 1`,
    `-- Used to populate the "Richtung" dropdown in the report form.`,
    `-- ============================================================`,
    ``,
    `CREATE TABLE IF NOT EXISTS line_directions (`,
    `  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),`,
    `  line_id        TEXT NOT NULL REFERENCES lines (id) ON DELETE CASCADE,`,
    `  terminus_first TEXT NOT NULL,`,
    `  terminus_last  TEXT NOT NULL,`,
    `  CONSTRAINT line_directions_line_unique UNIQUE (line_id)`,
    `);`,
    ``,
  ];

  let directionRowCount = 0;

  for (const type of typeOrder) {
    const group = byType.get(type);
    if (!group || group.length === 0) continue;

    lines004.push(`-- ── ${typeLabels[type]} ${'─'.repeat(40 - typeLabels[type].length)}`);

    for (const line of group) {
      const route = canonicalRoutes.get(line.lineId);
      if (!route || route.dir1.length === 0) continue;

      const firstEntry = route.dir1[0]!;
      const lastEntry  = route.dir1[route.dir1.length - 1]!;
      const first = stopById.get(firstEntry.stopId) ?? `UNKNOWN_${firstEntry.stopId}`;
      const last  = stopById.get(lastEntry.stopId)  ?? `UNKNOWN_${lastEntry.stopId}`;

      lines004.push(
        `INSERT INTO line_directions (line_id, terminus_first, terminus_last)` +
        ` VALUES ('${sq(line.lineText)}', '${sq(first)}', '${sq(last)}')` +
        ` ON CONFLICT (line_id) DO NOTHING;`,
      );
      directionRowCount++;
    }
    lines004.push('');
  }

  writeFileSync(
    join(MIGRATIONS, '004_seed_directions.sql'),
    lines004.join('\n'),
    'utf-8',
  );
  console.log(`  ✓ 004_seed_directions.sql  (${directionRowCount} direction rows)`);

  // ── Sanity check summary ───────────────────────────────────────────────────

  console.log('\n── Sanity Check ──────────────────────────────────────────');
  console.log(`  Lines total      : ${wlLines.length}`);
  for (const type of typeOrder) {
    const count = byType.get(type)?.length ?? 0;
    console.log(`    ${typeLabels[type].padEnd(24)}: ${count}`);
  }
  console.log(`  Stops in DB      : ${stopById.size}`);
  console.log(`  Station rows     : ${stationRowCount}`);
  console.log(`  Direction rows   : ${directionRowCount}`);
  console.log(`  Lines with routes: ${canonicalRoutes.size}`);

  const unknownStops = wlLines
    .flatMap((l) => canonicalRoutes.get(l.lineId)?.dir1 ?? [])
    .filter((e) => !stopById.has(e.stopId));
  if (unknownStops.length > 0) {
    console.warn(`\n  ⚠ ${unknownStops.length} route entries had unknown StopIDs — check output SQL for UNKNOWN_ prefixed names.`);
  } else {
    console.log(`  Unknown stop IDs : 0 ✓`);
  }

  console.log('\nAll files written to supabase/migrations/\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
