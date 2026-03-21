// Mock sighting data — used until the real API is wired up.
// 8 realistic sightings across different lines with varied ages.

export interface Sighting {
  id: string;
  line: string;
  station: string | null;
  direction: string | null;
  type: 'mobil' | 'stationär' | null;
  description: string | null;
  reportedAt: Date;
  source: 'telegram' | 'app';
}

const now = new Date();
const minutesAgo = (n: number): Date => new Date(now.getTime() - n * 60_000);

export const MOCK_SIGHTINGS: Sighting[] = [
  {
    id: '1',
    line: 'U4',
    station: 'Karlsplatz',
    direction: 'Hütteldorf',
    type: 'mobil',
    description: null,
    reportedAt: minutesAgo(5),
    source: 'telegram',
  },
  {
    id: '2',
    line: 'U3',
    station: 'Stephansplatz',
    direction: null,
    type: 'mobil',
    description: 'Zwei Kontrolleure beim Eingang Richtung Herrengasse',
    reportedAt: minutesAgo(8),
    source: 'app',
  },
  {
    id: '3',
    line: 'U6',
    station: 'Westbahnhof',
    direction: 'Floridsdorf',
    type: 'stationär',
    description: 'Drei Kontrolleure beim Ausgang Gürtelseite',
    reportedAt: minutesAgo(12),
    source: 'telegram',
  },
  {
    id: '4',
    line: '13A',
    station: null,
    direction: 'Meidling Hauptstraße',
    type: 'mobil',
    description: null,
    reportedAt: minutesAgo(23),
    source: 'app',
  },
  {
    id: '5',
    line: '71',
    station: 'Zentralfriedhof 3. Tor',
    direction: null,
    type: 'stationär',
    description: null,
    reportedAt: minutesAgo(18),
    source: 'telegram',
  },
  {
    id: '6',
    line: 'U1',
    station: 'Reumannplatz',
    direction: 'Leopoldau',
    type: 'stationär',
    description: null,
    reportedAt: minutesAgo(34),
    source: 'telegram',
  },
  {
    id: '7',
    line: '62',
    station: null,
    direction: 'Lainz/Speising',
    type: 'mobil',
    description: null,
    reportedAt: minutesAgo(45),
    source: 'telegram',
  },
  {
    id: '8',
    line: 'U2',
    station: 'Praterstern',
    direction: 'Seestadt',
    type: null,
    description: null,
    reportedAt: minutesAgo(55),
    source: 'telegram',
  },
];
