// Displays a single controller sighting in the terminal card style.
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
    <article className="border border-zinc-800 bg-zinc-950 p-3 space-y-1.5">
      {/* Row 1: line badge | station | time ago */}
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 px-1.5 py-0.5 text-xs font-bold tracking-wider ${getLineBadgeClass(line)}`}
        >
          {line}
        </span>

        <span className="flex-1 text-sm font-semibold uppercase tracking-wider truncate">
          {station ?? '—'}
        </span>

        <span className="shrink-0 text-xs text-zinc-500 tabular-nums">
          {timeAgo(reportedAt)}
        </span>
      </div>

      {/* Row 2: direction + type chip (only if at least one is present) */}
      {(direction !== null || type !== null) && (
        <div className="flex items-center gap-3 pl-0">
          {direction !== null && (
            <span className="text-xs text-zinc-400">
              → {direction}
            </span>
          )}
          {type !== null && (
            <span
              className={`text-xs border px-1.5 py-0.5 uppercase tracking-widest font-semibold ${
                type === 'mobil'
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-orange-500 text-orange-400'
              }`}
            >
              {type}
            </span>
          )}
        </div>
      )}

      {/* Row 3: free-text description */}
      {description !== null && (
        <p className="text-xs text-zinc-500 italic leading-relaxed">
          {description}
        </p>
      )}

      {/* Source indicator — bottom-right */}
      <div className="flex justify-end">
        <span className="text-[10px] text-zinc-700 uppercase tracking-widest">
          {source === 'telegram' ? 'TG' : 'APP'}
        </span>
      </div>
    </article>
  );
}
