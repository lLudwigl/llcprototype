// Displays a single controller sighting as a clean card.
import { getLineBadgeClass } from '../lib/lines';
import { timeAgo } from '../lib/timeAgo';

interface SightingCardProps {
  line: string;
  station: string | null;
  direction: string | null;
  type: 'mobil' | 'stationär' | null;
  description: string | null;
  reportedAt: Date;
  source: 'telegram' | 'app';
}

export function SightingCard({
  line,
  station,
  direction,
  type,
  description,
  reportedAt,
  source,
}: SightingCardProps): JSX.Element {
  return (
    <article className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
      {/* Line badge — colored square */}
      <span
        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold tracking-wide ${getLineBadgeClass(line)}`}
      >
        {line}
      </span>

      {/* Middle: station + direction */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {station ?? '—'}
        </p>
        {direction !== null && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            → {direction}
          </p>
        )}
        {description !== null && (
          <p className="text-xs text-gray-400 mt-0.5 italic truncate">
            {description}
          </p>
        )}
      </div>

      {/* Right: type chip + time + source */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        {type !== null && (
          <span
            className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
              type === 'mobil'
                ? 'bg-rose-100 text-rose-500'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {type === 'mobil' ? 'MOBIL' : 'STATIONÄR'}
          </span>
        )}
        <span className="text-xs text-gray-400 tabular-nums uppercase tracking-wider">
          {timeAgo(reportedAt)}
        </span>
        <span className="text-[10px] text-gray-300 uppercase tracking-widest">
          {source === 'telegram' ? 'TG' : 'APP'}
        </span>
      </div>

      {/* Chevron */}
      <span className="shrink-0 text-gray-300 text-sm">›</span>
    </article>
  );
}
