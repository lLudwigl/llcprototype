// Parser test suite — every parser change must have a corresponding test case
import { describe, it, expect } from 'vitest';
import { parseMessage } from './index.js';

describe('parseMessage', () => {
  it('returns null for empty string', () => {
    expect(parseMessage('')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(parseMessage('   ')).toBeNull();
  });

  // Real test cases will be added as the parser logic is implemented.
  // Example shape of what a passing result will look like:
  //
  // it('parses a simple U-Bahn sighting', () => {
  //   const result = parseMessage('Kontrolleure U4 Richtung Heiligenstadt, Station Karlsplatz');
  //   expect(result).toMatchObject({
  //     line: 'U4',
  //     lineType: 'U',
  //     station: 'Karlsplatz',
  //     direction: 'Heiligenstadt',
  //   });
  // });
});
