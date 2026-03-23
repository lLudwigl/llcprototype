// Persists and loads the GramJS session string from a local file.
// The session string lets us reconnect without re-authenticating each time.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Store the session file next to the .env in the api package root.
const SESSION_FILE = resolve(__dirname, '../../.telegram-session');

export function loadSessionString(): string {
  // Prefer env variable, fall back to file.
  if (process.env['TELEGRAM_SESSION']) {
    return process.env['TELEGRAM_SESSION'];
  }
  if (existsSync(SESSION_FILE)) {
    return readFileSync(SESSION_FILE, 'utf-8').trim();
  }
  return '';
}

export function saveSessionString(session: string): void {
  writeFileSync(SESSION_FILE, session, 'utf-8');
  console.log(`[Telegram] Session saved to ${SESSION_FILE}`);
}
