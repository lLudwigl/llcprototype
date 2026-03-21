// Home page — search bar + full feed of all recent sightings.
import { SearchBar } from '../components/SearchBar';
import { SightingCard } from '../components/SightingCard';
import { MOCK_SIGHTINGS } from '../lib/mockData';

// Sort newest first
const sortedSightings = [...MOCK_SIGHTINGS].sort(
  (a, b) => b.reportedAt.getTime() - a.reportedAt.getTime(),
);

export default function Home(): JSX.Element {
  return (
    <div className="px-4 pt-4 pb-4 space-y-5 max-w-xl mx-auto">
      {/* Search */}
      <SearchBar />

      {/* Feed */}
      <section className="space-y-2">
        <h2 className="text-xs text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2">
          — AKTUELLE MELDUNGEN
        </h2>

        {sortedSightings.length === 0 ? (
          <p className="text-zinc-700 text-xs py-8 text-center uppercase tracking-wider">
            Keine Meldungen
          </p>
        ) : (
          <div className="space-y-px">
            {sortedSightings.map((s) => (
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
      </section>
    </div>
  );
}
