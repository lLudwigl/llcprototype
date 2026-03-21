// API server entry point — loads env, registers plugins and routes, starts listening.
// dotenv must be imported before anything that reads process.env (including db.ts).
import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';

import healthRoutes from './routes/health.js';
import sightingsRoutes from './routes/sightings.js';
import linesRoutes from './routes/lines.js';

const PORT = Number(process.env['PORT'] ?? 3000);
const HOST = process.env['HOST'] ?? '0.0.0.0';
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

const app = Fastify({ logger: true });

// Allow all origins in development; lock to prod domain in production.
// CORS_ORIGIN env var must be set before deploying to production.
await app.register(cors, {
  origin:
    NODE_ENV === 'production'
      ? (process.env['CORS_ORIGIN'] ??
          (() => {
            throw new Error('Missing required env variable: CORS_ORIGIN');
          })())
      : true,
});

// Routes
await app.register(healthRoutes);
await app.register(sightingsRoutes);
await app.register(linesRoutes);

try {
  await app.listen({ port: PORT, host: HOST });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
