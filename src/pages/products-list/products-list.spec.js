import { beforeEach, describe, expect, it } from 'vitest';

import { renderProductsList } from './index.js';

describe('renderProductsList', () => {
  let containerEl;

  const rowEls = () => containerEl.querySelectorAll('#productsTableBody tr');
  const count = () => containerEl.querySelector('#productsCount').textContent;

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderProductsList(containerEl);
  });

  it('renders the first five products with a count', () => {
    expect(rowEls()).toHaveLength(5);
    expect(count()).toBe('Showing 5 of 30 products');
  });

  it('loads five more products and updates the count', () => {
    containerEl.querySelector('#loadMore').click();

    expect(rowEls()).toHaveLength(10);
    expect(count()).toBe('Showing 10 of 30 products');
  });

  it('hides the load more button once all products are shown', () => {
    const loadMoreEl = containerEl.querySelector('#loadMore');
    for (let i = 0; i < 5; i += 1) loadMoreEl.click();

    expect(rowEls()).toHaveLength(30);
    expect(count()).toBe('Showing 30 of 30 products');
    expect(loadMoreEl.style.display).toBe('none');
  });

  it('adds and removes a product from the wishlist', () => {
    containerEl.querySelector('[data-action="add"][data-id="1"]').click();
    const firstRow = rowEls()[0];
    expect(firstRow.querySelector('.wishlist-cell').textContent).toBe(
      'Added to wishlist'
    );

    firstRow.querySelector('[data-action="remove"]').click();
    expect(rowEls()[0].querySelector('.wishlist-cell').textContent).toBe(
      'Removed from wishlist'
    );
    expect(rowEls()[0].querySelector('[data-action="add"]')).not.toBeNull();
  });
});
