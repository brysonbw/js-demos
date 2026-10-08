import { describe, expect, it } from 'vitest';

import { ROUTES } from '../../utils/constants.js';
import { renderNotFound } from './index.js';

describe('renderNotFound', () => {
  it('links back to the home route', () => {
    const container = document.createElement('div');
    renderNotFound(container);

    const homeLink = container.querySelector('a.button');
    expect(homeLink).toHaveAttribute('href', ROUTES.HOME.hash);
  });
});
