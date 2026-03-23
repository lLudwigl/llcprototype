// Home page — search bar + live feed of all recent sightings from the API.
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/SearchBar';
import { SightingCard } from '../components/SightingCard';
import { getRecentSightings } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';

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

export default function Home(): JSX.Element {
  const { data: sightings, isLoading, isError } = useQuery({
    queryKey: queryKeys.recentSightings,
    queryFn: getRecentSightings,
  });

  return (
    <div className="px-4 pt-5 pb-4 space-y-5 max-w-xl mx-auto">
      <SearchBar />

      <section className="space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          AKTUELLE MELDUNGEN
        </h2>

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
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
          <p className="text-gray-400 text-xs py-8 text-center uppercase tracking-wider">
            Keine aktuellen Meldungen
          </p>
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
      </section>
    </div>
  );
}
