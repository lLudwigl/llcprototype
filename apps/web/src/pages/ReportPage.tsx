// Report form — lets users submit a new controller sighting.
// Currently fires a success toast; API call will be wired up in a later task.
import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ALL_LINES, getLineBadgeClass } from '../lib/lines';

const MAX_DESC_LENGTH = 200;

export default function ReportPage(): JSX.Element {
  const [line, setLine] = useState('');
  const [lineQuery, setLineQuery] = useState('');
  const [lineDropdownOpen, setLineDropdownOpen] = useState(false);
  const [station, setStation] = useState('');
  const [direction, setDirection] = useState('');
  const [type, setType] = useState<'mobil' | 'stationär' | null>(null);
  const [description, setDescription] = useState('');

  const lineContainerRef = useRef<HTMLDivElement>(null);

  const lineMatches = lineQuery.trim().length === 0
    ? ALL_LINES
    : ALL_LINES.filter((l) =>
        l.toLowerCase().startsWith(lineQuery.trim().toLowerCase())
      );

  // Close line dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (
        lineContainerRef.current &&
        !lineContainerRef.current.contains(e.target as Node)
      ) {
        setLineDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectLine(l: string): void {
    setLine(l);
    setLineQuery(l);
    setLineDropdownOpen(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!line) {
      toast.error('Bitte eine Linie auswählen.');
      return;
    }

    // TODO (Task 4): replace with real API call to POST /api/sightings
    toast.success('Meldung eingereicht. Danke!');

    // Reset form
    setLine('');
    setLineQuery('');
    setStation('');
    setDirection('');
    setType(null);
    setDescription('');
  }

  return (
    <div className="px-4 pt-4 pb-8 space-y-5 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
        <Link to="/" className="text-zinc-600 hover:text-white text-xs transition-colors">
          ←
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-widest">
          [ + ] MELDUNG EINREICHEN
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {/* ── Linie ──────────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block">
            Linie <span className="text-red-500">*</span>
          </label>
          <div ref={lineContainerRef} className="relative">
            <div className="flex items-center border border-zinc-700 bg-zinc-950 focus-within:border-white transition-colors">
              {line && (
                <span className={`ml-3 shrink-0 px-1.5 py-0.5 text-xs font-bold ${getLineBadgeClass(line)}`}>
                  {line}
                </span>
              )}
              <input
                type="text"
                value={lineQuery}
                onChange={(e) => {
                  setLineQuery(e.target.value);
                  setLine('');
                  setLineDropdownOpen(true);
                }}
                onFocus={() => setLineDropdownOpen(true)}
                placeholder="z.B. U4, 13A"
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-zinc-600 font-mono focus:outline-none"
                autoComplete="off"
              />
            </div>

            {lineDropdownOpen && lineMatches.length > 0 && (
              <ul className="absolute z-50 w-full border border-zinc-700 border-t-0 bg-zinc-950 max-h-48 overflow-y-auto">
                {lineMatches.slice(0, 10).map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => selectLine(l)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors text-left"
                    >
                      <span className={`px-1.5 py-0.5 text-xs font-bold ${getLineBadgeClass(l)}`}>
                        {l}
                      </span>
                      <span className="text-zinc-400 uppercase tracking-wider text-xs">
                        Linie {l}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Station ────────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block">
            Station
          </label>
          <input
            type="text"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            placeholder="z.B. Karlsplatz"
            className="w-full bg-zinc-950 border border-zinc-700 focus:border-white px-3 py-3 text-sm text-white placeholder-zinc-600 font-mono transition-colors focus:outline-none"
          />
        </div>

        {/* ── Richtung ───────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block">
            Richtung
          </label>
          <input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="z.B. Hütteldorf"
            className="w-full bg-zinc-950 border border-zinc-700 focus:border-white px-3 py-3 text-sm text-white placeholder-zinc-600 font-mono transition-colors focus:outline-none"
          />
        </div>

        {/* ── Typ ────────────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block">
            Typ
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['mobil', 'stationär'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(type === t ? null : t)}
                className={`py-3 text-sm uppercase tracking-widest font-bold border transition-colors ${
                  type === t
                    ? t === 'mobil'
                      ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10'
                      : 'border-orange-500 text-orange-400 bg-orange-500/10'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t === 'mobil' ? 'MOBIL' : 'STATIONÄR'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Beschreibung ───────────────────────────────────── */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <label className="text-xs text-zinc-500 uppercase tracking-widest">
              Beschreibung <span className="text-zinc-700 normal-case">(optional)</span>
            </label>
            <span className={`text-xs tabular-nums ${description.length > MAX_DESC_LENGTH - 20 ? 'text-orange-400' : 'text-zinc-700'}`}>
              {description.length}/{MAX_DESC_LENGTH}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESC_LENGTH) {
                setDescription(e.target.value);
              }
            }}
            placeholder="Weitere Details…"
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-700 focus:border-white px-3 py-3 text-sm text-white placeholder-zinc-600 font-mono transition-colors focus:outline-none resize-none"
          />
        </div>

        {/* ── Submit ─────────────────────────────────────────── */}
        <button
          type="submit"
          className="w-full py-4 border border-white text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors"
        >
          [ MELDUNG SENDEN ]
        </button>

        {/* Disclaimer */}
        <p className="text-center text-xs text-zinc-700 pt-1">
          Anonym · Keine Registrierung erforderlich
        </p>
      </form>
    </div>
  );
}
