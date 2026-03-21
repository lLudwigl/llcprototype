// Routes for reading and submitting controller sightings.
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db.js';

interface DbSighting {
  id: string;
  line: string;
  station: string | null;
  direction: string | null;
  type: 'mobil' | 'stationär' | null;
  description: string | null;
  raw_message: string | null;
  source: 'telegram' | 'app';
  reported_at: Date;
  expires_at: Date;
}

interface CreateSightingBody {
  line: string;
  station?: string;
  direction?: string;
  type?: 'mobil' | 'stationär';
  description?: string;
}

const sightingsRoutes: FastifyPluginAsync = async (fastify) => {

  // GET /api/sightings/recent — all active sightings across all lines, newest first
  // "Active" means expires_at > NOW() — never filter by reported_at directly.
  fastify.get('/api/sightings/recent', async (_request, reply) => {
    try {
      const result = await db.query<DbSighting>(
        `SELECT * FROM sightings
         WHERE expires_at > NOW()
         ORDER BY reported_at DESC
         LIMIT 50`,
      );
      return result.rows;
    } catch (err) {
      fastify.log.error(err, 'Failed to fetch recent sightings');
      return reply.code(500).send({ error: 'Interner Fehler' });
    }
  });

  // GET /api/sightings?line=U4 — active sightings for a specific line
  fastify.get<{ Querystring: { line?: string } }>(
    '/api/sightings',
    async (request, reply) => {
      const { line } = request.query;

      if (!line || line.trim() === '') {
        return reply.code(400).send({ error: 'Query-Parameter "line" ist erforderlich' });
      }

      try {
        const result = await db.query<DbSighting>(
          `SELECT * FROM sightings
           WHERE line = $1 AND expires_at > NOW()
           ORDER BY reported_at DESC`,
          [line.trim()],
        );
        return result.rows;
      } catch (err) {
        fastify.log.error(err, 'Failed to fetch sightings for line');
        return reply.code(500).send({ error: 'Interner Fehler' });
      }
    },
  );

  // POST /api/sightings — submit a new sighting from the in-app report form
  fastify.post<{ Body: CreateSightingBody }>(
    '/api/sightings',
    async (request, reply) => {
      const { line, station, direction, type, description } = request.body ?? {};

      if (!line || line.trim() === '') {
        return reply.code(400).send({ error: '"line" darf nicht leer sein' });
      }

      // expires_at is a plain column — must be set explicitly on every insert.
      // It is always reported_at + 2 hours; we let Postgres compute both with NOW().
      try {
        const result = await db.query<DbSighting>(
          `INSERT INTO sightings
             (line, station, direction, type, description, source, reported_at, expires_at)
           VALUES
             ($1, $2, $3, $4, $5, 'app', NOW(), NOW() + INTERVAL '2 hours')
           RETURNING *`,
          [
            line.trim(),
            station?.trim() ?? null,
            direction?.trim() ?? null,
            type ?? null,
            description?.trim() ?? null,
          ],
        );

        return reply.code(201).send(result.rows[0]);
      } catch (err) {
        fastify.log.error(err, 'Failed to insert sighting');
        return reply.code(500).send({ error: 'Interner Fehler' });
      }
    },
  );
};

export default sightingsRoutes;
