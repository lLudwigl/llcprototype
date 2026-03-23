// Search bar with live dropdown for Wiener Linien line selection.
// Line list is fetched from the API; falls back to the static list while loading.
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLines } from '../lib/api';
import { queryKeys } from '../lib/queryKeys';
import { ALL_LINES, getLineBadgeClass } from '../lib/lines';

export function SearchBar(): JSX.Element {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use API lines; fall back to static list while loading or on error
  const { data: apiLines } = useQuery({
    queryKey: queryKeys.lines,
    queryFn: getLines,
  });
  const lineIds: string[] = apiLines?.map((l) => l.id) ?? ALL_LINES;

  const matches =
    query.trim().length === 0
      ? []
      : lineIds
          .filter((l) => l.toLowerCase().startsWith(query.trim().toLowerCase()))
          .slice(0, 8);

  function selectLine(lineId: string): void {
    setQuery('');
    setOpen(false);
    navigate(`/linie/${lineId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && matches.length > 0 && matches[0] !== undefined) {
      selectLine(matches[0]);
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-[#0F1B3C] focus-within:ring-2 focus-within:ring-[#0F1B3C]/10 transition-all">
        <span className="pl-4 text-gray-400 text-base select-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Linie oder Station suchen..."
          className="flex-1 bg-transparent px-3 py-3.5 text-sm text-gray-900 placeholder-gray-400 font-sans focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        {query.length > 0 && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="pr-4 text-gray-400 hover:text-gray-600 text-lg"
            aria-label="Suche löschen"
          >
            ×
          </button>
        )}
      </div>

      {open && matches.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {matches.map((lineId) => (
            <li key={lineId}>
              <button
                onClick={() => selectLine(lineId)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-left"
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getLineBadgeClass(lineId)}`}>
                  {lineId}
                </span>
                <span className="text-gray-700 text-sm">
                  Linie {lineId}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
