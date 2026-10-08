import { describe, expect, it } from 'vitest';

import { renderHome } from './index.js';

describe('renderHome', () => {
  it('renders JavaScript, motivation, and purpose sections in order', () => {
    const container = document.createElement('div');
    renderHome(container);

    expect(container.querySelectorAll('.home-section')).toHaveLength(3);
    expect(
      [...container.querySelectorAll('.home-section h2')].map(
        (heading) => heading.textContent
      )
    ).toEqual(['Why just JavaScript?', 'Motivation', 'Why does this exist?']);
    expect(container.querySelector('.home').textContent).toContain(
      'learn in public'
    );
    const homeText = container
      .querySelector('.home')
      .textContent.replace(/\s+/g, ' ');
    expect(homeText).toContain('whiteboarding exercises');
  });
});
