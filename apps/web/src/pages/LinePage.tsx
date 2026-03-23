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
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 animate-pulse shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="space-y-1 items-end flex flex-col">
        <div className="h-4 bg-gray-100 rounded-full w-14" />
        <div className="h-3 bg-gray-100 rounded w-10" />
      </div>
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
        <p className="text-gray-400 text-sm uppercase tracking-wider">Unbekannte Linie</p>
        <Link to="/" className="text-xs text-gray-400 underline hover:text-navy mt-2 block">
          ← Zurück
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4 space-y-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <Link to="/" className="text-gray-400 hover:text-[#0F1B3C] text-sm transition-colors font-semibold">
          ←
        </Link>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${getLineBadgeClass(lineId)}`}>
          {lineId}
        </span>
        <h1 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
          Linie {lineId}
        </h1>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SightingSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-xs text-red-500 uppercase tracking-wider py-6 text-center font-semibold">
          Verbindung zur API fehlgeschlagen
        </p>
      )}

      {sightings !== undefined && sightings.length === 0 && (
        <EmptyState lineId={lineId} />
      )}

      {sightings !== undefined && sightings.length > 0 && (
        <div className="space-y-2">
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
