import { beforeEach, describe, expect, it } from 'vitest';

import { renderTabs } from './index.js';

describe('renderTabs', () => {
  let containerEl;

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderTabs(containerEl);
  });

  it('renders three tabs and three content items', () => {
    expect(containerEl.querySelectorAll('#tabs button')).toHaveLength(3);
    expect(containerEl.querySelectorAll('#tabContent p')).toHaveLength(3);
  });

  it('activates the first tab by default', () => {
    const buttonEls = containerEl.querySelectorAll('#tabs button');
    const contentEls = containerEl.querySelectorAll('#tabContent p');

    expect(buttonEls[0]).toHaveClass('active');
    expect(contentEls[0].style.display).toBe('block');
    expect(contentEls[1].style.display).toBe('none');
    expect(contentEls[2].style.display).toBe('none');
  });

  it('switches the active tab on click', () => {
    const buttonEls = containerEl.querySelectorAll('#tabs button');
    const contentEls = containerEl.querySelectorAll('#tabContent p');

    buttonEls[2].click();

    expect(buttonEls[0]).not.toHaveClass('active');
    expect(buttonEls[2]).toHaveClass('active');
    expect(contentEls[0].style.display).toBe('none');
    expect(contentEls[2].style.display).toBe('block');
  });

  it('keeps only one tab active at a time', () => {
    const buttonEls = containerEl.querySelectorAll('#tabs button');

    buttonEls[1].click();
    buttonEls[2].click();

    expect(buttonEls[1]).not.toHaveClass('active');
    expect(buttonEls[2]).toHaveClass('active');
  });
});
