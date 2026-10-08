import { beforeEach, describe, expect, it } from 'vitest';

import { renderProductsList } from './index.js';

describe('renderProductsList', () => {
  let container;

  const rows = () => container.querySelectorAll('#productsTableBody tr');
  const count = () => container.querySelector('#productsCount').textContent;

  beforeEach(() => {
    container = document.createElement('div');
    renderProductsList(container);
  });

  it('renders the first five products with a count', () => {
    expect(rows()).toHaveLength(5);
    expect(count()).toBe('Showing 5 of 30 products');
  });

  it('loads five more products and updates the count', () => {
    container.querySelector('#loadMore').click();

    expect(rows()).toHaveLength(10);
    expect(count()).toBe('Showing 10 of 30 products');
  });

  it('hides the load more button once all products are shown', () => {
    const loadMore = container.querySelector('#loadMore');
    for (let i = 0; i < 5; i += 1) loadMore.click();

    expect(rows()).toHaveLength(30);
    expect(count()).toBe('Showing 30 of 30 products');
    expect(loadMore.style.display).toBe('none');
  });

  it('adds and removes a product from the wishlist', () => {
    container.querySelector('[data-action="add"][data-id="1"]').click();
    const firstRow = rows()[0];
    expect(firstRow.querySelector('.wishlist-cell').textContent).toBe(
      'Added to wishlist'
    );

    firstRow.querySelector('[data-action="remove"]').click();
    expect(rows()[0].querySelector('.wishlist-cell').textContent).toBe(
      'Removed from wishlist'
    );
    expect(rows()[0].querySelector('[data-action="add"]')).not.toBeNull();
  });
});
