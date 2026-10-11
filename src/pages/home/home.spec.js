import { describe, expect, it } from 'vitest';

import { renderHome } from './index.js';

describe('renderHome', () => {
  it('renders JavaScript, motivation, and purpose sections in order', () => {
    const containerEl = document.createElement('div');
    renderHome(containerEl);

    expect(containerEl.querySelectorAll('.home-section')).toHaveLength(3);
    expect(
      [...containerEl.querySelectorAll('.home-section h2')].map(
        (heading) => heading.textContent
      )
    ).toEqual(['Why just JavaScript?', 'Motivation', 'Why does this exist?']);
    expect(containerEl.querySelector('.home').textContent).toContain(
      'learn in public'
    );
    const homeText = containerEl
      .querySelector('.home')
      .textContent.replace(/\s+/g, ' ');
    expect(homeText).toContain('whiteboarding exercises');
  });
});
