// Parser package — pure functions only. No I/O, no side effects.
// Input: raw Telegram message string
// Output: ParseResult (structured sighting) or null if the message should be discarded

/** All Wiener Linien line types we recognise */
export type LineType = 'U' | 'S' | 'Tram' | 'Bus' | 'NightBus';

/** Whether the controllers are mobile (moving through the vehicle) or stationary (at a stop) */
export type ControllerType = 'mobil' | 'stationär' | 'unbekannt';

export interface ParseResult {
  /** Normalised line identifier, e.g. "U4", "13A", "S7" */
  line: string;
  lineType: LineType;
  /** Station or stop name as reported */
  station: string | null;
  /** Direction as reported, e.g. "Richtung Heiligenstadt" */
  direction: string | null;
  controllerType: ControllerType;
  /** Free-text description from the original message, if any */
  description: string | null;
}

/**
 * Attempt to parse a raw Telegram message into a structured sighting.
 * Returns null if the message cannot be confidently interpreted.
 * When in doubt, discard — bad data is worse than missing data.
 */
export function parseMessage(raw: string): ParseResult | null {
  // Placeholder — real parsing logic will be implemented in a later task
  if (!raw || raw.trim().length === 0) return null;
  return null;
}
