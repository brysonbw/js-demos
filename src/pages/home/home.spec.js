import { describe, expect, it } from 'vitest';

import { renderHome } from './index.js';

describe('renderHome', () => {
  it('renders the intro paragraphs', () => {
    const container = document.createElement('div');
    renderHome(container);

    expect(container.querySelectorAll('p.home')).toHaveLength(2);
  });
});
