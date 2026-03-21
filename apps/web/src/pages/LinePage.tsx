// Line detail page — shows sightings for a single line, e.g. /linie/U4.
import { useParams, Link } from 'react-router-dom';
import { SightingCard } from '../components/SightingCard';
import { EmptyState } from '../components/EmptyState';
import { MOCK_SIGHTINGS } from '../lib/mockData';
import { getLineBadgeClass, ALL_LINES } from '../lib/lines';

export default function LinePage(): JSX.Element {
  const { lineId } = useParams<{ lineId: string }>();

  // Validate that this is a line we know about
  const isKnownLine = lineId !== undefined && ALL_LINES.includes(lineId);

  const sightings = isKnownLine
    ? [...MOCK_SIGHTINGS]
        .filter((s) => s.line === lineId)
        .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
    : [];

  if (!isKnownLine || lineId === undefined) {
    return (
      <div className="px-4 pt-8 text-center space-y-4">
        <p className="text-zinc-500 text-sm uppercase tracking-wider">
          Unbekannte Linie: {lineId ?? '—'}
        </p>
        <Link to="/" className="text-xs text-zinc-700 underline hover:text-white">
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

      {/* Sightings */}
      {sightings.length === 0 ? (
        <EmptyState lineId={lineId} />
      ) : (
        <div className="space-y-px">
          {sightings.map((s) => (
            <SightingCard
              key={s.id}
              line={s.line}
              station={s.station}
              direction={s.direction}
              type={s.type}
              description={s.description}
              reportedAt={s.reportedAt}
              source={s.source}
            />
          ))}
        </div>
      )}
    </div>
  );
}
