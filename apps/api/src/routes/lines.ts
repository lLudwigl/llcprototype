// Routes for browsing lines and their stations.
import type { FastifyPluginAsync } from 'fastify';
import { db } from '../db.js';

interface DbLine {
  id: string;
  name: string;
  type: string;
}

interface DbStation {
  id: string;
  name: string;
}

const linesRoutes: FastifyPluginAsync = async (fastify) => {

  // GET /api/lines — all lines, sorted by type then id
  fastify.get('/api/lines', async (_request, reply) => {
    try {
      const result = await db.query<DbLine>(
        'SELECT id, name, type FROM lines ORDER BY type, id',
      );
      return result.rows;
    } catch (err) {
      fastify.log.error(err, 'Failed to fetch lines');
      return reply.code(500).send({ error: 'Interner Fehler' });
    }
  });

  // GET /api/lines/:lineId/stations — stops for one line, in stop_order
  fastify.get<{ Params: { lineId: string } }>(
    '/api/lines/:lineId/stations',
    async (request, reply) => {
      const { lineId } = request.params;

      try {
        const result = await db.query<DbStation>(
          'SELECT id, name FROM stations WHERE line_id = $1 ORDER BY stop_order',
          [lineId],
        );

        if (result.rows.length === 0) {
          return reply.code(404).send({ error: `Linie ${lineId} nicht gefunden` });
        }

        return result.rows;
      } catch (err) {
        fastify.log.error(err, 'Failed to fetch stations');
        return reply.code(500).send({ error: 'Interner Fehler' });
      }
    },
  );
};

export default linesRoutes;
