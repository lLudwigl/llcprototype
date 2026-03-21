// Parser test suite — every parser change must have a corresponding test case
import { describe, it, expect, beforeEach } from 'vitest';
import { SightingParser } from './index.js';

describe('SightingParser', () => {
  let parser: SightingParser;

  beforeEach(async () => {
    parser = new SightingParser();
    await parser.init();
  });

  it('sets shouldDiscard for empty string', () => {
    expect(parser.parse('').shouldDiscard).toBe(true);
  });

  it('sets shouldDiscard for whitespace-only string', () => {
    expect(parser.parse('   ').shouldDiscard).toBe(true);
  });
});
