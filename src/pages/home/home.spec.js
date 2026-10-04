import { describe, expect, it } from 'vitest';

import { APP_NAME } from '../../utils/constants.js';
import { renderHome } from './index.js';

describe('renderHome', () => {
  it('renders the heading with the app name', () => {
    const container = document.createElement('div');
    renderHome(container);

    expect(container.querySelector('#page-title').textContent).toBe(
      `What is ${APP_NAME}?`
    );
  });

  it('renders the vanilla JS copy', () => {
    const container = document.createElement('div');
    renderHome(container);

    expect(container.textContent).toContain('Why vanilla?');
  });
});
