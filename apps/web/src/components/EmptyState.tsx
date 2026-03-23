// Empty state for when no sightings exist for a line.
interface EmptyStateProps {
  lineId?: string;
}

export function EmptyState({ lineId }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3">
      <div className="bg-white border border-gray-100 rounded-2xl px-8 py-10 space-y-2 max-w-xs w-full shadow-sm">
        <p className="text-3xl mb-2">🎉</p>
        <p className="text-gray-900 font-bold text-sm uppercase tracking-wider">
          KEINE AKTUELLEN MELDUNGEN
          {lineId ? ` FÜR LINIE ${lineId}` : ''}
        </p>
        <p className="text-gray-400 text-xs pt-1">
          Meldungen verfallen nach 2 Stunden
        </p>
      </div>
    </div>
  );
}
