// Health check route — always 200 as long as the process is alive.
// Does NOT check the database, so Railway/Vercel health probes never fail the process.
import type { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => ({ status: 'ok' }));
};

export default healthRoutes;
