// React Query cache key constants.
// Centralising keys here prevents cache misses caused by typos or key drift.

export const queryKeys = {
  recentSightings: ['sightings', 'recent'] as const,
  sightingsByLine: (line: string) => ['sightings', 'line', line] as const,
  lines: ['lines'] as const,
  stationsByLine: (lineId: string) => ['lines', lineId, 'stations'] as const,
};
