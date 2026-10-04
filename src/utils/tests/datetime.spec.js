import { describe, expect, it } from 'vitest';

import { getCurrentYear } from '../datetime.js';

describe('getCurrentYear', () => {
  it('returns the current year', () => {
    expect(getCurrentYear()).toBe(new Date().getFullYear());
  });

  it('returns a number', () => {
    expect(typeof getCurrentYear()).toBe('number');
  });
});
