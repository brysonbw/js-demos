import { beforeEach, describe, expect, it } from 'vitest';

import { renderImageCarousel } from './index.js';

describe('renderImageCarousel', () => {
  let containerEl;

  const imageEls = () => containerEl.querySelectorAll('.carousel-image');
  const dotEls = () => containerEl.querySelectorAll('.dot-btn');

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderImageCarousel(containerEl);
  });

  it('renders the images with descriptive alt text and selects the first by default', () => {
    expect(imageEls()).toHaveLength(6);
    expect([...imageEls()].map((image) => image.alt)).toEqual([
      'Forest',
      'Beach',
      'Yak',
      'Hay',
      'Plants',
      'Building',
    ]);
    expect([...imageEls()].map((image) => image.hidden)).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it('renders accessible numbered image selectors', () => {
    expect(dotEls()).toHaveLength(6);
    expect([...dotEls()].map((dot) => dot.textContent)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
    ]);
    expect([...dotEls()].map((dot) => dot.getAttribute('aria-label'))).toEqual([
      'Show Forest',
      'Show Beach',
      'Show Yak',
      'Show Hay',
      'Show Plants',
      'Show Building',
    ]);
    expect(dotEls()[0]).toHaveAttribute('aria-current', 'true');
    expect(dotEls()[0]).toHaveClass('active');
  });

  it('moves to the next image and wraps from last to first', () => {
    containerEl.querySelector('.next-btn').click();
    expect(imageEls()[0].hidden).toBe(true);
    expect(imageEls()[1].hidden).toBe(false);
    expect(dotEls()[1]).toHaveAttribute('aria-current', 'true');
    expect(dotEls()[1]).toHaveClass('active');

    for (let index = 1; index < imageEls().length; index += 1) {
      containerEl.querySelector('.next-btn').click();
    }

    expect(imageEls()[0].hidden).toBe(false);
    expect(imageEls()[5].hidden).toBe(true);
    expect(dotEls()[0]).toHaveAttribute('aria-current', 'true');
  });

  it('moves to the previous image and wraps from first to last', () => {
    containerEl.querySelector('.prev-btn').click();

    expect(imageEls()[0].hidden).toBe(true);
    expect(imageEls()[5].hidden).toBe(false);
    expect(dotEls()[5]).toHaveAttribute('aria-current', 'true');
    expect(dotEls()[5]).toHaveClass('active');
  });

  it('selects an image when its numbered chip is clicked', () => {
    dotEls()[3].click();

    expect(imageEls()[3].hidden).toBe(false);
    expect(imageEls()[0].hidden).toBe(true);
    expect(dotEls()[3]).toHaveAttribute('aria-current', 'true');
    expect(dotEls()[3]).toHaveClass('active');
    expect(dotEls()[0]).toHaveAttribute('aria-current', 'false');
    expect(dotEls()[0]).not.toHaveClass('active');
  });
});
