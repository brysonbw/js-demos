import { describe, expect, it } from 'vitest';

import { ROUTES } from '../../utils/constants.js';
import { renderNotFound } from './index.js';

describe('renderNotFound', () => {
  it('links back to the home route', () => {
    const containerEl = document.createElement('div');
    renderNotFound(containerEl);

    const homeLinkEl = containerEl.querySelector('a.button');
    expect(homeLinkEl).toHaveAttribute('href', ROUTES.HOME.hash);
  });
});
