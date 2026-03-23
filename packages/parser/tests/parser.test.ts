import { describe, it, expect, beforeEach } from 'vitest';
import { SightingParser } from '../src/index.js';

describe('SightingParser', () => {
    let parser: SightingParser;

    beforeEach(async () => {
        parser = new SightingParser();
        // Mock API data fetch for tests
        await parser.init(async () => [
            "Schottentor",
            "Seestadt",
            "Längenfeldgasse",
            "Westbahnhof",
            "Landstraße",
            "Hauptbahnhof"
        ]);
    });

    it('parses: U2 Schottentor richtung seestadt', () => {
        const result = parser.parse("U2 Schottentor richtung seestadt");
        expect(result.line).toBe("U2");
        expect(result.station).toBe("Schottentor");
        expect(result.direction).toBe("Seestadt");
        expect(result.shouldDiscard).toBe(false);
    });

    it('parses: U4/U6 Längenfeldgasse stationär', () => {
        const result = parser.parse("U4/U6 Längenfeldgasse stationär");
        expect(result.line).toBe("U4");
        expect(result.station).toBe("Längenfeldgasse");
        expect(result.type).toBe("stationär");
        expect(result.shouldDiscard).toBe(false);
    });

    it('discards negative match: Hbf frei', () => {
        const result = parser.parse("Hbf frei");
        expect(result.shouldDiscard).toBe(true);
    });

    it('applies slang mapping: Westbhf -> Westbahnhof', () => {
        const result = parser.parse("U3 Westbhf mobil");
        expect(result.station).toBe("Westbahnhof");
        expect(result.type).toBe("mobil");
        expect(result.line).toBe("U3");
        expect(result.shouldDiscard).toBe(false);
    });
});
