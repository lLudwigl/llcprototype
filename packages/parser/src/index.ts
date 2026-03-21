import { distance } from 'fastest-levenshtein';

export type LineType = 'U' | 'S' | 'Tram' | 'Bus' | 'NightBus';
export type ControllerType = 'mobil' | 'stationär' | 'unbekannt';

export interface ParseResult {
  line: string | null;
  station: string | null;
  direction: string | null;
  type: ControllerType | null;
  description: string | null;
  shouldDiscard: boolean;
}

export class SightingParser {
  private stations: string[] = [];
  
  // Slang mapping
  private stationSlang: Record<string, string> = {
    'westbhf': 'Westbahnhof',
    'mitte': 'Landstraße',
    'hbf': 'Hauptbahnhof'
  };

  private lineRegex = /\b(U[1-6]|[0-9]{1,3}[A-Z]?|S[0-9]{1,2})\b/i;
  private discardKeywords = ['frei', 'weg', 'ausgestiegen', 'nichts', 'leer', 'vorbei'];

  constructor() {}

  /**
   * Initializes the parser by loading the async stations list.
   * Accepts a fetchStations function to load data from an API or DB.
   */
  async init(fetchStations?: () => Promise<string[]>) {
    if (fetchStations) {
      this.stations = await fetchStations();
    } else {
      this.stations = [];
    }
  }

  parse(message: string): ParseResult {
    const raw = message.trim();
    if (!raw) {
      return this.emptyResult(true);
    }
    
    const lowerRaw = raw.toLowerCase();

    // 1. Negativ-Filter
    if (this.discardKeywords.some(kw => lowerRaw.includes(kw))) {
      return this.emptyResult(true);
    }

    // 2. Line detection
    let line: string | null = null;
    const lineMatch = raw.match(this.lineRegex);
    if (lineMatch && lineMatch[1]) {
      line = lineMatch[1].toUpperCase();
    } else {
       // Check for "43er" etc
       const erMatch = raw.match(/\b([0-9]{1,3})er\b/i);
       if (erMatch && erMatch[1]) {
           line = erMatch[1];
       }
    }

    // 3. Type detection
    let type: ControllerType | null = null;
    const mobilWords = ['mobil', 'zivil'];
    const statWords = ['stationär', 'fest', 'ausgang'];
    
    const words = lowerRaw.split(/\W+/);
    for (const word of words) {
        if (!word) continue;
        if (mobilWords.some(w => distance(w, word) <= 1)) type = 'mobil';
        else if (statWords.some(w => distance(w, word) <= 2)) type = 'stationär';
    }

    // 4. Direction
    let direction: string | null = null;
    const dirMatch = raw.match(/\b(richtung|rtg\.?|nach|ri\.?)\s+([a-zA-ZäöüßÄÖÜ]+(?:[ -][a-zA-ZäöüßÄÖÜ]+)*)/i);
    if (dirMatch && dirMatch[2]) {
        // Capitalize the first letter for cleaner output, e.g. "seestadt" -> "Seestadt"
        direction = dirMatch[2].charAt(0).toUpperCase() + dirMatch[2].slice(1).toLowerCase();
    }

    // 5. Station detection
    let station: string | null = null;
    
    const mappedWords = words.map(w => this.stationSlang[w] || w);
    
    let bestDist = Infinity;
    let bestStation = null;
    
    for (const w of mappedWords) {
        if (w.length < 3) continue;
        
        for (const s of this.stations) {
            const sLower = s.toLowerCase();
            if (sLower === w) {
                bestDist = 0;
                bestStation = s;
                break;
            }
            const dist = distance(sLower, w);
            // Fuzzy match (Levenshtein <= 2)
            if (dist <= 2 && dist < bestDist) {
                bestDist = dist;
                bestStation = s;
            }
        }
        if (bestDist === 0) break;
    }

    if (bestStation) {
        station = bestStation;
    }

    return {
      line,
      station,
      direction,
      type,
      description: null,
      shouldDiscard: false
    };
  }

  private emptyResult(shouldDiscard = false): ParseResult {
    return {
      line: null,
      station: null,
      direction: null,
      type: null,
      description: null,
      shouldDiscard
    };
  }
}
