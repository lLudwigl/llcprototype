# Supabase — Database Setup

This folder contains the SQL migration files for Schwarzkappler.
Run them in the Supabase SQL Editor in the exact order shown below.

---

## First-time setup

### Step 1 — Open the SQL Editor

1. Go to [supabase.com](https://supabase.com) and open your project
2. In the left sidebar, click **SQL Editor**
3. Click **New query** (top-right button)

---

### Step 2 — Run the schema migration

1. Open [migrations/001_initial_schema.sql](migrations/001_initial_schema.sql)
2. Copy the entire file contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd+Enter / Ctrl+Enter)

This creates three tables:
- `lines` — one row per Wiener Linien line
- `stations` — stops along each line, in order
- `sightings` — controller sightings reported by users or the Telegram bot

---

### Step 3 — Run the seed file

1. Open [migrations/002_seed_lines.sql](migrations/002_seed_lines.sql)
2. Copy the entire file contents
3. Paste into a **new** SQL Editor query tab
4. Click **Run**

This inserts:
- All 5 U-Bahn lines (U1–U4, U6) with full stop sequences
- 26 tram lines with terminus stops
- 2 bus lines (13A, 14A) with terminus stops

---

## Verifying the setup

Run these queries in the SQL Editor to confirm everything landed correctly:

```sql
-- Should return 33 rows (5 U-Bahn + 26 tram + 2 bus)
SELECT type, count(*) FROM lines GROUP BY type ORDER BY type;

-- Should return 98+ rows
SELECT count(*) FROM stations;

-- Should return 0 rows (no sightings yet — that's correct)
SELECT count(*) FROM sightings;
```

---

## Re-running after a mistake

If you need to start fresh, run this **before** the migration files:

```sql
DROP TABLE IF EXISTS sightings;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS lines;
```

Then re-run Step 2 and Step 3 above.

---

## Important rules (do not break these)

- **Never filter sightings by `reported_at`** — always use `expires_at > now()`
  The `expires_at` column is the single source of truth for whether a sighting is active.

- **Never add a non-nullable column** to an existing table without a default value —
  it would break existing rows.

- **Number your migration files in order** — `003_`, `004_`, etc.
  Never modify a file that has already been run in production.

---

## Getting the connection string

1. In your Supabase project, go to **Settings → Database**
2. Copy the **Connection string** (URI format)
3. Paste it as `DATABASE_URL` in `apps/api/.env`

Never commit `.env` files. They are gitignored.
