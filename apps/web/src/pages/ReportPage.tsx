// Report form — submits a new controller sighting to the API.
import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getLines,
  getStationsByLine,
  getDirectionsByLine,
  createSighting,
  type CreateSightingBody,
} from '../lib/api';
import { queryKeys } from '../lib/queryKeys';
import { ALL_LINES, getLineBadgeClass } from '../lib/lines';

const MAX_DESC_LENGTH = 200;

export default function ReportPage(): JSX.Element {
  const navigate = useNavigate();

  const [line, setLine] = useState('');
  const [lineQuery, setLineQuery] = useState('');
  const [lineDropdownOpen, setLineDropdownOpen] = useState(false);
  const [station, setStation] = useState('');
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const [direction, setDirection] = useState('');
  const [type, setType] = useState<'mobil' | 'stationär' | null>(null);
  const [description, setDescription] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBody, setPendingBody] = useState<CreateSightingBody | null>(null);

  const lineContainerRef = useRef<HTMLDivElement>(null);
  const stationContainerRef = useRef<HTMLDivElement>(null);

  // Lines from API — fall back to static list while loading
  const { data: apiLines } = useQuery({
    queryKey: queryKeys.lines,
    queryFn: getLines,
  });
  const allLineIds: string[] = apiLines?.map((l) => l.id) ?? ALL_LINES;

  // Stations for the selected line — only fetch once a line is chosen
  const { data: stations } = useQuery({
    queryKey: queryKeys.stationsByLine(line),
    queryFn: () => getStationsByLine(line),
    enabled: line.length > 0,
  });

  // Directions (terminus options) for the selected line
  const { data: directions } = useQuery({
    queryKey: queryKeys.directionsByLine(line),
    queryFn: () => getDirectionsByLine(line),
    enabled: line.length > 0,
  });

  const lineMatches =
    lineQuery.trim().length === 0
      ? allLineIds
      : allLineIds.filter((l) =>
          l.toLowerCase().startsWith(lineQuery.trim().toLowerCase()),
        );

  const stationMatches =
    stations === undefined
      ? []
      : station.trim().length === 0
        ? stations
        : stations.filter((s) =>
            s.name.toLowerCase().includes(station.trim().toLowerCase()),
          );

  const mutation = useMutation({
    mutationFn: createSighting,
    onSuccess: () => {
      setShowConfirmModal(false);
      toast.success('Meldung eingereicht!');
      navigate('/');
    },
    onError: () => {
      toast.error('Fehler beim Einreichen');
    },
  });

  // Close line dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent): void {
      if (lineContainerRef.current && !lineContainerRef.current.contains(e.target as Node)) {
        setLineDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close station dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent): void {
      if (stationContainerRef.current && !stationContainerRef.current.contains(e.target as Node)) {
        setStationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectLine(l: string): void {
    setLine(l);
    setLineQuery(l);
    setLineDropdownOpen(false);
    // Reset dependent fields when line changes
    setStation('');
    setDirection('');
  }

  function selectStation(name: string): void {
    setStation(name);
    setStationDropdownOpen(false);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!line) {
      toast.error('Bitte eine Linie auswählen.');
      return;
    }

    // Build body without undefined properties (required by exactOptionalPropertyTypes)
    const body: CreateSightingBody = { line };
    if (station.trim().length > 0) body.station = station.trim();
    if (direction.trim().length > 0) body.direction = direction.trim();
    if (type !== null) body.type = type;
    if (description.trim().length > 0) body.description = description.trim();

    // Show confirmation modal instead of submitting immediately
    setPendingBody(body);
    setShowConfirmModal(true);
  }

  function handleConfirm(): void {
    if (pendingBody) {
      mutation.mutate(pendingBody);
    }
  }

  const isSubmitting = mutation.isPending;

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
                  setStation('');
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
          <div ref={stationContainerRef} className="relative">
            <input
              type="text"
              value={station}
              onChange={(e) => {
                setStation(e.target.value);
                setStationDropdownOpen(true);
              }}
              onFocus={() => setStationDropdownOpen(true)}
              placeholder={line ? 'Station wählen…' : 'Zuerst Linie wählen'}
              disabled={!line}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-white px-3 py-3 text-sm text-white placeholder-zinc-600 font-mono transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            />

            {stationDropdownOpen && stationMatches.length > 0 && (
              <ul className="absolute z-50 w-full border border-zinc-700 border-t-0 bg-zinc-950 max-h-48 overflow-y-auto">
                {stationMatches.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => selectStation(s.name)}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-zinc-800 transition-colors text-zinc-300 uppercase tracking-wide"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Richtung ───────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-widest block">
            Richtung
          </label>

          {/* Dropdown when directions are available from DB */}
          {directions !== undefined && directions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {[directions[0]!.terminus_first, directions[0]!.terminus_last].map((terminus) => (
                <button
                  key={terminus}
                  type="button"
                  onClick={() => setDirection(direction === terminus ? '' : terminus)}
                  className={`px-3 py-3 text-sm text-left border transition-colors font-mono truncate ${
                    direction === terminus
                      ? 'border-white text-white bg-white/10'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                  }`}
                  title={terminus}
                >
                  → {terminus}
                </button>
              ))}
            </div>
          ) : (
            /* Free-text fallback: no line selected, or line has no directions in DB */
            <input
              type="text"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              disabled={!line}
              placeholder={line ? 'z.B. Hütteldorf' : 'Zuerst Linie auswählen'}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-white px-3 py-3 text-sm text-white placeholder-zinc-600 font-mono transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            />
          )}
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
              Beschreibung{' '}
              <span className="text-zinc-700 normal-case">(optional)</span>
            </label>
            <span
              className={`text-xs tabular-nums ${
                description.length > MAX_DESC_LENGTH - 20
                  ? 'text-orange-400'
                  : 'text-zinc-700'
              }`}
            >
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
          disabled={isSubmitting}
          className="w-full py-4 border border-white text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '[ … ]' : '[ MELDUNG SENDEN ]'}
        </button>

        <p className="text-center text-xs text-zinc-700 pt-1">
          Anonym · Keine Registrierung erforderlich
        </p>
      </form>

      {/* ── Confirmation modal ─────────────────────────────── */}
      {showConfirmModal && pendingBody && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 px-4 pb-6 sm:pb-0">
          <div className="w-full max-w-sm border border-zinc-700 bg-zinc-950 p-5 space-y-4">

            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
              [ ! ] MELDUNG PRÜFEN
            </h2>

            {/* Summary rows */}
            <dl className="space-y-2 text-sm font-mono">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 uppercase tracking-wider text-xs shrink-0">Linie</dt>
                <dd>
                  <span className={`px-1.5 py-0.5 text-xs font-bold ${getLineBadgeClass(pendingBody.line)}`}>
                    {pendingBody.line}
                  </span>
                </dd>
              </div>

              {pendingBody.station && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500 uppercase tracking-wider text-xs shrink-0">Station</dt>
                  <dd className="text-zinc-200 text-right">{pendingBody.station}</dd>
                </div>
              )}

              {pendingBody.direction && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500 uppercase tracking-wider text-xs shrink-0">Richtung</dt>
                  <dd className="text-zinc-200 text-right">→ {pendingBody.direction}</dd>
                </div>
              )}

              {pendingBody.type && (
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500 uppercase tracking-wider text-xs shrink-0">Typ</dt>
                  <dd className={`text-xs font-bold uppercase ${pendingBody.type === 'mobil' ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {pendingBody.type === 'mobil' ? 'MOBIL' : 'STATIONÄR'}
                  </dd>
                </div>
              )}

              {pendingBody.description && (
                <div className="flex flex-col gap-1">
                  <dt className="text-zinc-500 uppercase tracking-wider text-xs">Beschreibung</dt>
                  <dd className="text-zinc-300 text-xs leading-relaxed border-l border-zinc-700 pl-3">{pendingBody.description}</dd>
                </div>
              )}

              {/* If only line was filled in */}
              {!pendingBody.station && !pendingBody.direction && !pendingBody.type && !pendingBody.description && (
                <p className="text-zinc-600 text-xs">Keine weiteren Details angegeben.</p>
              )}
            </dl>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="py-3 text-xs uppercase tracking-widest font-bold border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-40"
              >
                ← BEARBEITEN
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="py-3 text-xs uppercase tracking-widest font-bold border border-white text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '[ … ]' : '[ SENDEN ]'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
