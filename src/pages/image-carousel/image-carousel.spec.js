import { beforeEach, describe, expect, it } from 'vitest';

import { renderImageCarousel } from './index.js';

describe('renderImageCarousel', () => {
  let container;

  const images = () => container.querySelectorAll('.carousel-image');
  const dots = () => container.querySelectorAll('.dot-btn');

  beforeEach(() => {
    container = document.createElement('div');
    renderImageCarousel(container);
  });

  it('renders the images with descriptive alt text and selects the first by default', () => {
    expect(images()).toHaveLength(6);
    expect([...images()].map((image) => image.alt)).toEqual([
      'Forest',
      'Beach',
      'Yak',
      'Hay',
      'Plants',
      'Building',
    ]);
    expect([...images()].map((image) => image.hidden)).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it('renders accessible numbered image selectors', () => {
    expect(dots()).toHaveLength(6);
    expect([...dots()].map((dot) => dot.textContent)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
    ]);
    expect([...dots()].map((dot) => dot.getAttribute('aria-label'))).toEqual([
      'Show Forest',
      'Show Beach',
      'Show Yak',
      'Show Hay',
      'Show Plants',
      'Show Building',
    ]);
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');
    expect(dots()[0]).toHaveClass('active');
  });

  it('moves to the next image and wraps from last to first', () => {
    container.querySelector('.next-btn').click();
    expect(images()[0].hidden).toBe(true);
    expect(images()[1].hidden).toBe(false);
    expect(dots()[1]).toHaveAttribute('aria-current', 'true');
    expect(dots()[1]).toHaveClass('active');

    for (let index = 1; index < images().length; index += 1) {
      container.querySelector('.next-btn').click();
    }

    expect(images()[0].hidden).toBe(false);
    expect(images()[5].hidden).toBe(true);
    expect(dots()[0]).toHaveAttribute('aria-current', 'true');
  });

  it('moves to the previous image and wraps from first to last', () => {
    container.querySelector('.prev-btn').click();

    expect(images()[0].hidden).toBe(true);
    expect(images()[5].hidden).toBe(false);
    expect(dots()[5]).toHaveAttribute('aria-current', 'true');
    expect(dots()[5]).toHaveClass('active');
  });

  it('selects an image when its numbered chip is clicked', () => {
    dots()[3].click();

    expect(images()[3].hidden).toBe(false);
    expect(images()[0].hidden).toBe(true);
    expect(dots()[3]).toHaveAttribute('aria-current', 'true');
    expect(dots()[3]).toHaveClass('active');
    expect(dots()[0]).toHaveAttribute('aria-current', 'false');
    expect(dots()[0]).not.toHaveClass('active');
  });
});
