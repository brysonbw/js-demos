import { describe, expect, it } from 'vitest';

import { ROUTES } from '../../utils/constants.js';
import { renderNotFound } from './index.js';

describe('renderNotFound', () => {
  it('renders the 404 heading', () => {
    const container = document.createElement('div');
    renderNotFound(container);

    expect(container.querySelector('#page-title').textContent).toBe(
      'Page not found'
    );
  });

  it('links back to the home route', () => {
    const container = document.createElement('div');
    renderNotFound(container);

    const homeLink = container.querySelector('a.button');
    expect(homeLink).toHaveAttribute('href', ROUTES.HOME.hash);
  });
});
