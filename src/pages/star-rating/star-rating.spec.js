import { beforeEach, describe, expect, it } from 'vitest';

import { renderStarRating } from './index.js';

describe('renderStarRating', () => {
  let containerEl;
  let starButtonEls;

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderStarRating(containerEl);
    starButtonEls = containerEl.querySelectorAll('.star');
  });

  it('renders five accessible stars with no rating selected by default', () => {
    expect(containerEl.querySelector('.star-rating')).toHaveAttribute(
      'aria-label',
      'Rate this item'
    );
    expect(starButtonEls).toHaveLength(5);
    expect(
      [...starButtonEls].every(
        (star) => star.getAttribute('aria-pressed') === 'false'
      )
    ).toBe(true);
    expect(
      [...starButtonEls].some((star) => star.classList.contains('filled'))
    ).toBe(false);
    expect(containerEl.querySelector('.star-rating-value')).toHaveTextContent(
      '0 out of 5 stars'
    );
  });

  it('updates the selected rating when a star is clicked', () => {
    starButtonEls[1].click();

    expect(starButtonEls[1]).toHaveAttribute('aria-pressed', 'true');
    expect(starButtonEls[3]).toHaveAttribute('aria-pressed', 'false');
    expect(containerEl.querySelector('.star-rating-value')).toHaveTextContent(
      '2 out of 5 stars'
    );
    expect(starButtonEls[0]).toHaveClass('filled');
    expect(starButtonEls[1]).toHaveClass('filled');
    expect(starButtonEls[2]).not.toHaveClass('filled');
  });

  it('keeps the selected rating when its star is clicked again', () => {
    starButtonEls[1].click();
    starButtonEls[1].click();

    expect(starButtonEls[1]).toHaveAttribute('aria-pressed', 'true');
    expect(containerEl.querySelector('.star-rating-value')).toHaveTextContent(
      '2 out of 5 stars'
    );
  });

  it('previews a hovered rating and restores the selected rating on mouse leave', () => {
    starButtonEls[3].click();
    starButtonEls[0].dispatchEvent(new MouseEvent('mouseenter'));

    expect(starButtonEls[0]).toHaveClass('filled');
    expect(starButtonEls[1]).not.toHaveClass('filled');
    expect(starButtonEls[3]).toHaveAttribute('aria-pressed', 'true');

    containerEl
      .querySelector('.star-rating')
      .dispatchEvent(new MouseEvent('mouseleave'));

    expect(starButtonEls[3]).toHaveClass('filled');
    expect(starButtonEls[4]).not.toHaveClass('filled');
  });
});
