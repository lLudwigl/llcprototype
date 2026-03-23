// Telegram MTProto listener — connects as a user account via GramJS,
// listens for new messages in the configured group, parses them, and
// inserts valid sightings into the database.
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage, type NewMessageEvent } from 'telegram/events/index.js';
import { SightingParser } from '@schwarzkappler/parser';
import { db } from '../db.js';
import { saveSessionString, loadSessionString } from './session.js';
import * as readline from 'node:readline';

const API_ID = Number(process.env['TELEGRAM_API_ID']);
const API_HASH = process.env['TELEGRAM_API_HASH'] ?? '';
const GROUP_ID = process.env['TELEGRAM_GROUP_ID'] ?? '';

function validateEnv(): void {
  if (!API_ID || isNaN(API_ID)) {
    throw new Error('Missing required env variable: TELEGRAM_API_ID');
  }
  if (!API_HASH) {
    throw new Error('Missing required env variable: TELEGRAM_API_HASH');
  }
  if (!GROUP_ID) {
    throw new Error('Missing required env variable: TELEGRAM_GROUP_ID');
  }
}

// Prompts the user for input in the terminal (needed for first-time auth).
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Fetches all unique station names from the DB so the parser can fuzzy-match.
async function fetchStationNames(): Promise<string[]> {
  const result = await db.query<{ name: string }>(
    'SELECT DISTINCT name FROM stations ORDER BY name',
  );
  return result.rows.map((r) => r.name);
}

// Inserts a parsed sighting into the database.
// Mirrors the POST /api/sightings logic but with source = 'telegram' and raw_message set.
async function insertSighting(
  parsed: { line: string; station: string | null; direction: string | null; type: string | null; description: string | null },
  rawMessage: string,
): Promise<void> {
  await db.query(
    `INSERT INTO sightings
       (line, station, direction, type, description, raw_message, source, reported_at, expires_at)
     VALUES
       ($1, $2, $3, $4, $5, $6, 'telegram', NOW(), NOW() + INTERVAL '2 hours')`,
    [
      parsed.line,
      parsed.station,
      parsed.direction,
      parsed.type === 'unbekannt' ? null : parsed.type,
      parsed.description,
      rawMessage,
    ],
  );
}

export async function startTelegramListener(): Promise<void> {
  validateEnv();

  const savedSession = loadSessionString();
  const session = new StringSession(savedSession);

  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  // First-time auth requires phone number + code (and possibly 2FA password).
  // After the first login the session string is saved so this won't happen again.
  await client.start({
    phoneNumber: () => prompt('Enter your Telegram phone number: '),
    password: () => prompt('Enter your 2FA password (if set): '),
    phoneCode: () => prompt('Enter the code Telegram sent you: '),
    onError: (err) => console.error('[Telegram auth error]', err),
  });

  // Persist the session so we skip auth on next restart.
  const sessionString = client.session.save() as unknown as string;
  if (sessionString && sessionString !== savedSession) {
    saveSessionString(sessionString);
    console.log('[Telegram] Session string saved — future restarts will auto-connect.');
  }

  console.log('[Telegram] Connected as user account.');

  // Init parser with station names from DB for fuzzy matching.
  const parser = new SightingParser();
  await parser.init(fetchStationNames);

  // GramJS reports supergroup chat IDs with the -100 prefix (e.g. -1001197544106).
  // Match against the full GROUP_ID string from .env.
  const targetChatId = GROUP_ID;

  client.addEventHandler(async (event: NewMessageEvent) => {
    try {
      const message = event.message;
      if (!message || !message.text) return;

      const chatId = message.chatId?.toString() ?? '';
      // Only process messages from our target group.
      if (chatId !== targetChatId && `-100${chatId}` !== targetChatId) {
        return;
      }

      const text = message.text.trim();
      if (!text) return;

      console.log(`[Telegram] New message: "${text.substring(0, 80)}${text.length > 80 ? '…' : ''}"`);

      const parsed = parser.parse(text);

      if (parsed.shouldDiscard) {
        console.log('[Telegram] Discarded (negative keyword or empty).');
        return;
      }

      const { line, station, direction, type, description } = parsed;

      if (!line) {
        console.log('[Telegram] Discarded (no line detected).');
        return;
      }

      await insertSighting({ line, station, direction, type, description }, text);
      console.log(`[Telegram] Sighting saved: ${line} ${station ?? '?'} ${direction ? '→ ' + direction : ''}`);
    } catch (err) {
      // Never let a bad message crash the listener.
      console.error('[Telegram] Error processing message:', err);
    }
  }, new NewMessage({}));

  console.log(`[Telegram] Listening for messages in group ${GROUP_ID}`);
}
