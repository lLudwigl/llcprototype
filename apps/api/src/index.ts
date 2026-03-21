// API server entry point — registers plugins and starts listening
import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = Fastify({ logger: true });

// Allow the frontend dev server in development; lock to prod domain in production.
// The CORS_ORIGIN env var must be set before deploying to production.
await app.register(cors, {
  origin: NODE_ENV === 'production'
    ? (process.env.CORS_ORIGIN ?? (() => { throw new Error('Missing required env variable: CORS_ORIGIN'); })())
    : true,
});

// Health check — always 200 as long as the process is alive
app.get('/health', async () => ({ status: 'ok' }));

// Placeholder: API routes will be registered here
// app.register(import('./routes/sightings.js'));

try {
  await app.listen({ port: PORT, host: HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
