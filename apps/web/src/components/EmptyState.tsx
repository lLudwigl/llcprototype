// Terminal-style empty state for when no sightings exist for a line.
interface EmptyStateProps {
  lineId?: string;
}

export function EmptyState({ lineId }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
      <div className="border border-zinc-800 px-6 py-8 space-y-2 max-w-xs w-full">
        <p className="text-zinc-600 text-xs uppercase tracking-widest">
          {lineId ? `[ ${lineId} ]` : '[ — ]'}
        </p>
        <p className="text-white text-sm uppercase tracking-wider leading-relaxed">
          KEINE AKTUELLEN<br />MELDUNGEN
          {lineId ? ` FÜR DIESE LINIE` : ''}
        </p>
        <p className="text-zinc-700 text-xs pt-2">
          _ sightings expire after 2h
        </p>
      </div>
    </div>
  );
}
