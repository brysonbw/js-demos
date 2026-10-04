import { beforeEach, describe, expect, it } from 'vitest';

import { renderTabs } from './index.js';

describe('renderTabs', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    renderTabs(container);
  });

  it('renders three tabs and three content items', () => {
    expect(container.querySelectorAll('#tabs button')).toHaveLength(3);
    expect(container.querySelectorAll('#tabContent p')).toHaveLength(3);
  });

  it('activates the first tab by default', () => {
    const buttons = container.querySelectorAll('#tabs button');
    const contents = container.querySelectorAll('#tabContent p');

    expect(buttons[0]).toHaveClass('active');
    expect(contents[0].style.display).toBe('block');
    expect(contents[1].style.display).toBe('none');
    expect(contents[2].style.display).toBe('none');
  });

  it('switches the active tab on click', () => {
    const buttons = container.querySelectorAll('#tabs button');
    const contents = container.querySelectorAll('#tabContent p');

    buttons[2].click();

    expect(buttons[0]).not.toHaveClass('active');
    expect(buttons[2]).toHaveClass('active');
    expect(contents[0].style.display).toBe('none');
    expect(contents[2].style.display).toBe('block');
  });

  it('keeps only one tab active at a time', () => {
    const buttons = container.querySelectorAll('#tabs button');

    buttons[1].click();
    buttons[2].click();

    expect(buttons[1]).not.toHaveClass('active');
    expect(buttons[2]).toHaveClass('active');
  });
});
