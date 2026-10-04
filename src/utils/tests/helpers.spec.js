import { describe, expect, it } from 'vitest';

import { padIndex } from '../helpers.js';

describe('padIndex', () => {
  it('pads single-digit indexes with a leading zero', () => {
    expect(padIndex(0)).toBe('01');
    expect(padIndex(8)).toBe('09');
  });

  it('does not pad double-digit indexes', () => {
    expect(padIndex(9)).toBe('10');
    expect(padIndex(41)).toBe('42');
  });
});
