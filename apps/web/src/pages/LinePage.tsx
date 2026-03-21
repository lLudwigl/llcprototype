// Line detail page — live sightings for a single line, e.g. /linie/U4.
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SightingCard } from '../components/SightingCard';
import { EmptyState } from '../components/EmptyState';
import { getSightingsByLine } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';
import { getLineBadgeClass } from '../lib/lines';

function SightingSkeleton(): JSX.Element {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-3 animate-pulse space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-5 bg-zinc-800" />
        <div className="flex-1 h-4 bg-zinc-800" />
        <div className="w-14 h-3 bg-zinc-800" />
      </div>
      <div className="w-36 h-3 bg-zinc-800" />
    </div>
  );
}

export default function LinePage(): JSX.Element {
  const { lineId } = useParams<{ lineId: string }>();

  const { data: sightings, isLoading, isError } = useQuery({
    queryKey: queryKeys.sightingsByLine(lineId ?? ''),
    queryFn: () => getSightingsByLine(lineId ?? ''),
    enabled: lineId !== undefined && lineId.length > 0,
  });

  if (!lineId) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-zinc-500 text-sm uppercase tracking-wider">Unbekannte Linie</p>
        <Link to="/" className="text-xs text-zinc-700 underline hover:text-white mt-2 block">
          ← Zurück
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
        <Link to="/" className="text-zinc-600 hover:text-white text-xs transition-colors">
          ←
        </Link>
        <span className={`px-2 py-1 text-sm font-bold tracking-wider ${getLineBadgeClass(lineId)}`}>
          {lineId}
        </span>
        <h1 className="text-sm uppercase tracking-wider text-zinc-400">
          Linie {lineId}
        </h1>
      </div>

      {isLoading && (
        <div className="space-y-px">
          {Array.from({ length: 3 }).map((_, i) => (
            <SightingSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-xs text-red-500 uppercase tracking-wider py-6 text-center">
          Verbindung zur API fehlgeschlagen
        </p>
      )}

      {sightings !== undefined && sightings.length === 0 && (
        <EmptyState lineId={lineId} />
      )}

      {sightings !== undefined && sightings.length > 0 && (
        <div className="space-y-px">
          {sightings.map((s) => (
            <SightingCard
              key={s.id}
              line={s.line}
              station={s.station}
              direction={s.direction}
              type={s.type}
              description={s.description}
              reportedAt={new Date(s.reported_at)}
              source={s.source}
            />
          ))}
        </div>
      )}
    </div>
  );
}
