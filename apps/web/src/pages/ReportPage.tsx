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

  // Shared input class
  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 font-sans transition-colors focus:outline-none focus:border-[#0F1B3C] focus:ring-2 focus:ring-[#0F1B3C]/10 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="px-4 pt-4 pb-8 space-y-5 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <Link to="/" className="text-gray-400 hover:text-[#0F1B3C] text-sm transition-colors font-semibold">
          ←
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-widest text-[#0F1B3C]">
          + MELDUNG EINREICHEN
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {/* ── Linie ──────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
            Linie <span className="text-red-500">*</span>
          </label>
          <div ref={lineContainerRef} className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-[#0F1B3C] focus-within:ring-2 focus-within:ring-[#0F1B3C]/10 transition-all">
              {line && (
                <span className={`ml-3 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${getLineBadgeClass(line)}`}>
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
                placeholder="z.B. U2, M10..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 placeholder-gray-400 font-sans focus:outline-none"
                autoComplete="off"
              />
            </div>

            {lineDropdownOpen && lineMatches.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {lineMatches.slice(0, 10).map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => selectLine(l)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getLineBadgeClass(l)}`}>
                        {l}
                      </span>
                      <span className="text-gray-700">
                        Linie {l}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Richtung ───────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
            Richtung
          </label>

          {directions !== undefined && directions.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {[directions[0]!.terminus_first, directions[0]!.terminus_last].map((terminus) => (
                <button
                  key={terminus}
                  type="button"
                  onClick={() => setDirection(direction === terminus ? '' : terminus)}
                  className={`px-4 py-3 text-sm text-left border rounded-xl transition-colors font-sans truncate ${
                    direction === terminus
                      ? 'border-[#0F1B3C] bg-[#0F1B3C]/5 text-[#0F1B3C] font-semibold'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white'
                  }`}
                  title={terminus}
                >
                  → {terminus}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              disabled={!line}
              placeholder={line ? 'Endstation...' : 'Zuerst Linie auswählen'}
              className={inputClass}
            />
          )}
        </div>

        {/* ── Station ────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
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
              placeholder={line ? 'Aktueller Halt...' : 'Zuerst Linie wählen'}
              disabled={!line}
              className={inputClass}
            />

            {stationDropdownOpen && stationMatches.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {stationMatches.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => selectStation(s.name)}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Typ ────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
            Typ
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['mobil', 'stationär'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(type === t ? null : t)}
                className={`py-3 text-sm uppercase tracking-widest font-bold border rounded-xl transition-colors ${
                  type === t
                    ? t === 'mobil'
                      ? 'border-rose-300 text-rose-500 bg-rose-50'
                      : 'border-gray-300 text-gray-600 bg-gray-50'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 bg-white'
                }`}
              >
                {t === 'mobil' ? '⚡ MOBIL' : '📍 STATIONÄR'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Beschreibung ───────────────────────────────────── */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Beschreibung{' '}
              <span className="text-gray-400 normal-case font-normal">(optional)</span>
            </label>
            <span
              className={`text-xs tabular-nums ${
                description.length > MAX_DESC_LENGTH - 20
                  ? 'text-orange-400'
                  : 'text-gray-300'
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
            placeholder="Besondere Merkmale, Anzahl der Kontrolleure..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 font-sans transition-colors focus:outline-none focus:border-[#0F1B3C] focus:ring-2 focus:ring-[#0F1B3C]/10 resize-none"
          />
        </div>

        {/* ── Submit ─────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#0F1B3C] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#0b1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '…' : '➤  [ MELDUNG SENDEN ]'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Durch das Absenden bestätigen Sie die Richtigkeit Ihrer Angaben.
        </p>
      </form>

      {/* ── Confirmation modal ─────────────────────────────── */}
      {showConfirmModal && pendingBody && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-0">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="bg-[#0F1B3C] px-5 py-4 flex items-center gap-2">
              <span className="text-white text-base">+</span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                MELDUNG PRÜFEN
              </h2>
            </div>

            <div className="p-5 space-y-4">
              {/* Summary rows */}
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-400 uppercase tracking-wider text-xs shrink-0 font-semibold">Linie</dt>
                  <dd>
                    <span className={`w-8 h-8 rounded-lg inline-flex items-center justify-center text-xs font-bold ${getLineBadgeClass(pendingBody.line)}`}>
                      {pendingBody.line}
                    </span>
                  </dd>
                </div>

                {pendingBody.station && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-400 uppercase tracking-wider text-xs shrink-0 font-semibold">Station</dt>
                    <dd className="text-gray-800 text-right text-sm">{pendingBody.station}</dd>
                  </div>
                )}

                {pendingBody.direction && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-400 uppercase tracking-wider text-xs shrink-0 font-semibold">Richtung</dt>
                    <dd className="text-gray-800 text-right text-sm">→ {pendingBody.direction}</dd>
                  </div>
                )}

                {pendingBody.type && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-400 uppercase tracking-wider text-xs shrink-0 font-semibold">Typ</dt>
                    <dd>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        pendingBody.type === 'mobil'
                          ? 'bg-rose-100 text-rose-500'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {pendingBody.type === 'mobil' ? 'MOBIL' : 'STATIONÄR'}
                      </span>
                    </dd>
                  </div>
                )}

                {pendingBody.description && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-gray-400 uppercase tracking-wider text-xs font-semibold">Beschreibung</dt>
                    <dd className="text-gray-700 text-xs leading-relaxed border-l-2 border-gray-200 pl-3">{pendingBody.description}</dd>
                  </div>
                )}

                {!pendingBody.station && !pendingBody.direction && !pendingBody.type && !pendingBody.description && (
                  <p className="text-gray-400 text-xs">Keine weiteren Details angegeben.</p>
                )}
              </dl>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="py-3 text-xs uppercase tracking-widest font-bold border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  ← BEARBEITEN
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="py-3 text-xs uppercase tracking-widest font-bold bg-[#0F1B3C] text-white rounded-xl hover:bg-[#0b1530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '…' : '[ SENDEN ]'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
