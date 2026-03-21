// Home page — search bar + live feed of all recent sightings from the API.
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/SearchBar';
import { SightingCard } from '../components/SightingCard';
import { getRecentSightings } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

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

export default function Home(): JSX.Element {
  const { data: sightings, isLoading, isError } = useQuery({
    queryKey: queryKeys.recentSightings,
    queryFn: getRecentSightings,
  });

  return (
    <div className="px-4 pt-4 pb-4 space-y-5 max-w-xl mx-auto">
      <SearchBar />

      <section className="space-y-2">
        <h2 className="text-xs text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2">
          — AKTUELLE MELDUNGEN
        </h2>

        {isLoading && (
          <div className="space-y-px">
            {Array.from({ length: 4 }).map((_, i) => (
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
          <p className="text-zinc-700 text-xs py-8 text-center uppercase tracking-wider">
            Keine aktuellen Meldungen
          </p>
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
      </section>
    </div>
  );
}
