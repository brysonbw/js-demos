import { describe, expect, it } from 'vitest';

import {
  APP_NAME,
  ROUTES,
  STORAGE_KEY_NAMESPACE,
  STORAGE_KEYS,
} from '../constants.js';

describe('constants', () => {
  it('defaults the app name when the env var is unset', () => {
    expect(APP_NAME).toBe('JS Demos');
  });

  it('derives the storage namespace from the app name', () => {
    expect(STORAGE_KEY_NAMESPACE).toBe('js-demos');
  });

  it('prefixes storage keys with the namespace', () => {
    expect(STORAGE_KEYS.THEME).toBe('js-demos-theme');
  });

  it('freezes the routes map and its entries', () => {
    expect(Object.isFrozen(ROUTES)).toBe(true);
    Object.values(ROUTES).forEach((entry) => {
      expect(Object.isFrozen(entry)).toBe(true);
    });
  });

  it('gives every navigable route a hash matching its route id', () => {
    const navigable = [
      ROUTES.HOME,
      ROUTES.CONTACT,
      ROUTES.TODO_LIST,
      ROUTES.ACCORDION,
      ROUTES.TABS,
    ];
    navigable.forEach((entry) => {
      expect(entry.hash).toBe(`#/${entry.route === 'home' ? '' : entry.route}`);
    });
  });

  it('freezes the storage keys map', () => {
    expect(Object.isFrozen(STORAGE_KEYS)).toBe(true);
  });
});
