// PostgreSQL connection pool — shared across all route handlers.
// DATABASE_URL is read from .env via dotenv, loaded before this module is imported.
import { Pool } from 'pg';

if (!process.env['DATABASE_URL']) {
  throw new Error('Missing required env variable: DATABASE_URL');
}

export const db = new Pool({
  connectionString: process.env['DATABASE_URL'],
  // Supabase requires SSL in production; the self-signed cert is acceptable here.
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});
