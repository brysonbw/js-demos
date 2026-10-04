import { beforeEach, describe, expect, it } from 'vitest';

import { renderAccordion } from './index.js';

describe('renderAccordion', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    renderAccordion(container);
  });

  it('renders three accordion items', () => {
    const titles = container.querySelectorAll('.accordion-title');
    expect(titles).toHaveLength(3);
  });

  it('hides all content sections by default', () => {
    const contents = container.querySelectorAll('.accordion-content');
    contents.forEach((content) => {
      expect(content).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('toggles content visibility when a title is clicked', () => {
    const title = container.querySelector('.accordion-title');
    const content = title.nextElementSibling;

    title.click();
    expect(content).toHaveAttribute('aria-hidden', 'false');

    title.click();
    expect(content).toHaveAttribute('aria-hidden', 'true');
  });

  it('toggles items independently', () => {
    const titles = container.querySelectorAll('.accordion-title');

    titles[0].click();
    titles[2].click();

    const contents = container.querySelectorAll('.accordion-content');
    expect(contents[0]).toHaveAttribute('aria-hidden', 'false');
    expect(contents[1]).toHaveAttribute('aria-hidden', 'true');
    expect(contents[2]).toHaveAttribute('aria-hidden', 'false');
  });
});
