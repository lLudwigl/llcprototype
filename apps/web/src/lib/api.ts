// Typed fetch functions for the Schwarzkappler REST API.
// All functions throw on non-2xx responses so React Query can catch and surface them.

const BASE_URL: string =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:3000';

/** Raw sighting as returned by the API (snake_case, ISO date strings). */
export interface ApiSighting {
  id: string;
  line: string;
  station: string | null;
  direction: string | null;
  type: 'mobil' | 'stationär' | null;
  description: string | null;
  raw_message: string | null;
  source: 'telegram' | 'app';
  reported_at: string;
  expires_at: string;
}

export interface ApiLine {
  id: string;
  name: string;
  type: string;
}

export interface ApiStation {
  id: string;
  name: string;
}

export interface CreateSightingBody {
  line: string;
  station?: string;
  direction?: string;
  type?: 'mobil' | 'stationär';
  description?: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getRecentSightings(): Promise<ApiSighting[]> {
  return apiFetch<ApiSighting[]>('/api/sightings/recent');
}

export async function getSightingsByLine(line: string): Promise<ApiSighting[]> {
  return apiFetch<ApiSighting[]>(`/api/sightings?line=${encodeURIComponent(line)}`);
}

export async function getLines(): Promise<ApiLine[]> {
  return apiFetch<ApiLine[]>('/api/lines');
}

export async function getStationsByLine(lineId: string): Promise<ApiStation[]> {
  return apiFetch<ApiStation[]>(`/api/lines/${encodeURIComponent(lineId)}/stations`);
}

export async function createSighting(data: CreateSightingBody): Promise<ApiSighting> {
  return apiFetch<ApiSighting>('/api/sightings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
