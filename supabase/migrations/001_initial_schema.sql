-- ============================================================
-- 001_initial_schema.sql
-- Core schema for Schwarzkappler.
-- Run this first, before any seed files.
-- ============================================================

-- ── lines ────────────────────────────────────────────────────
-- One row per Wiener Linien line (U1, 13A, 62, …)
CREATE TABLE lines (
  id   TEXT PRIMARY KEY,        -- e.g. "U4", "13A", "62"
  name TEXT NOT NULL,           -- e.g. "U4", "Linie 13A"
  type TEXT NOT NULL            -- one of: ubahn | tram | bus | sbahn
    CONSTRAINT lines_type_check CHECK (type IN ('ubahn', 'tram', 'bus', 'sbahn'))
);

-- ── stations ─────────────────────────────────────────────────
-- Stops along a line, in sequence.
-- stop_order is the position on the line (1 = first terminus).
CREATE TABLE stations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT    NOT NULL,
  line_id    TEXT    NOT NULL REFERENCES lines (id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL
);

-- Fast lookup: all stops for a given line, in order
CREATE INDEX stations_line_order_idx ON stations (line_id, stop_order);

-- ── sightings ────────────────────────────────────────────────
-- One row per reported controller sighting.
-- expires_at is set explicitly on insert as reported_at + 2 hours.
-- It is a plain column (not generated) due to PostgreSQL immutability rules.
CREATE TABLE sightings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  line        TEXT        NOT NULL REFERENCES lines (id),
  station     TEXT,                      -- nullable: not always reported
  direction   TEXT,                      -- nullable: not always reported
  type        TEXT                       -- "mobil" | "stationär" | null
    CONSTRAINT sightings_type_check CHECK (type IN ('mobil', 'stationär')),
  description TEXT,                      -- free-text from the original message
  raw_message TEXT,                      -- original Telegram message, for debugging
  source      TEXT        NOT NULL       -- "telegram" | "app"
    CONSTRAINT sightings_source_check CHECK (source IN ('telegram', 'app')),
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL       -- set by API as reported_at + INTERVAL '2 hours'
);

-- The primary query pattern: "give me all active sightings on line X"
-- expires_at > now() is the single correct filter — never filter by reported_at directly.
CREATE INDEX sightings_line_expires_idx ON sightings (line, expires_at);