// All active Wiener Linien lines — mirrors the database seed in 002_seed_lines.sql.
// Used for search suggestions and the report form dropdown.

export const ALL_LINES: string[] = [
  // U-Bahn
  'U1', 'U2', 'U3', 'U4', 'U6',
  // Tram
  '1', '2', '5', '6', '9', '10', '11', '18',
  '25', '26', '30', '31', '33',
  '37', '38', '40', '41', '42', '43', '44', '46', '49',
  '52', '60', '62', '71',
  // Bus
  '13A', '14A',
];

export type LineType = 'ubahn' | 'tram' | 'bus' | 'sbahn';

/** Derive the line type from a line ID string. */
export function getLineType(line: string): LineType {
  if (line.startsWith('U')) return 'ubahn';
  if (line.startsWith('S')) return 'sbahn';
  if (line.endsWith('A') || line.endsWith('B')) return 'bus';
  return 'tram';
}

/**
 * Returns the full Tailwind class string for a line badge.
 * Complete strings (not constructed dynamically) so Tailwind picks them up.
 */
export function getLineBadgeClass(line: string): string {
  const type = getLineType(line);
  switch (type) {
    case 'ubahn': return 'bg-red-600 text-white';
    case 'sbahn': return 'bg-blue-600 text-white';
    case 'bus':   return 'bg-green-600 text-white';
    case 'tram':  return 'bg-white text-black';
  }
}
