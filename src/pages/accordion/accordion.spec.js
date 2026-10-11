import { beforeEach, describe, expect, it } from 'vitest';

import { renderAccordion } from './index.js';

describe('renderAccordion', () => {
  let containerEl;

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderAccordion(containerEl);
  });

  it('renders three accordion items', () => {
    const titleEls = containerEl.querySelectorAll('.accordion-title');
    expect(titleEls).toHaveLength(3);
  });

  it('hides all content sections by default', () => {
    const contentEls = containerEl.querySelectorAll('.accordion-content');
    contentEls.forEach((content) => {
      expect(content).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('toggles content visibility when a title is clicked', () => {
    const titleEl = containerEl.querySelector('.accordion-title');
    const content = titleEl.nextElementSibling;

    titleEl.click();
    expect(content).toHaveAttribute('aria-hidden', 'false');

    titleEl.click();
    expect(content).toHaveAttribute('aria-hidden', 'true');
  });

  it('toggles items independently', () => {
    const titleEls = containerEl.querySelectorAll('.accordion-title');

    titleEls[0].click();
    titleEls[2].click();

    const contentEls = containerEl.querySelectorAll('.accordion-content');
    expect(contentEls[0]).toHaveAttribute('aria-hidden', 'false');
    expect(contentEls[1]).toHaveAttribute('aria-hidden', 'true');
    expect(contentEls[2]).toHaveAttribute('aria-hidden', 'false');
  });
});
