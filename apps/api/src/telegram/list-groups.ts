// One-off script to list all Telegram groups and their IDs.
// Run with: pnpm --filter @schwarzkappler/api tsx src/telegram/list-groups.ts
import 'dotenv/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { loadSessionString } from './session.js';

const API_ID = Number(process.env['TELEGRAM_API_ID']);
const API_HASH = process.env['TELEGRAM_API_HASH'] ?? '';

async function main(): Promise<void> {
  const session = new StringSession(loadSessionString());
  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  await client.connect();
  console.log('Connected. Fetching dialogs...\n');

  const dialogs = await client.getDialogs({ limit: 100 });

  console.log('=== Your groups and channels ===\n');
  for (const dialog of dialogs) {
    if (dialog.isGroup || dialog.isChannel) {
      const entity = dialog.entity;
      const id = entity && 'id' in entity ? entity.id : '?';
      console.log(`${dialog.title}  →  ID: -100${id}`);
    }
  }

  await client.disconnect();
}

main().catch(console.error);
