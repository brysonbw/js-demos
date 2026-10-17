import { products } from '../../data/products.js';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderProductsList(container) {
  container.innerHTML = `
      <p id="productsCount" aria-live="polite"></p>
      <table class="data-table data-table--centered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Wishlist Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="productsTableBody"></tbody>
      </table>
      <button id="loadMore" class="button button-primary">Load More</button>
  `;
  let productsCount = 5;
  const wishlistSet = new Set();
  const removedWishlistSet = new Set();

  const tableBodyEl = container.querySelector('#productsTableBody');
  const loadMoreButtonEl = container.querySelector('#loadMore');
  const productsCountDisplayEl = container.querySelector('#productsCount');

  /** @returns {void} */
  function renderRows() {
    const initialProducts = products.slice(0, productsCount);

    tableBodyEl.innerHTML = initialProducts
      .map((product) => {
        const isWishlisted = wishlistSet.has(product.id);
        const wishlistStatus = isWishlisted
          ? 'Added to wishlist'
          : removedWishlistSet.has(product.id)
            ? 'Removed from wishlist'
            : '-';
        return `
        <tr data-id="${product.id}">
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>$${product.price}</td>
          <td class="wishlist-cell">${wishlistStatus}</td>
          <td class="actions-cell">
            ${
              isWishlisted
                ? `<button class="wishlist-btn button" data-action="remove" data-id="${product.id}">Remove from Wishlist</button>`
                : `<button class="wishlist-btn button button-primary" data-action="add" data-id="${product.id}">Add to Wishlist</button>`
            }
          </td>
        </tr>
      `;
      })
      .join('');

    productsCountDisplayEl.textContent = `Showing ${initialProducts.length} of ${products.length} products`;

    // Hide button if all products are displayed
    if (productsCount >= products.length) {
      loadMoreButtonEl.style.display = 'none';
    }
  }

  // Event Delegation - Handle onClick for wishlist button
  tableBodyEl.addEventListener('click', function (event) {
    const button = event.target.closest('.wishlist-btn');
    if (button instanceof HTMLElement) {
      const productId = Number(button.dataset.id);
      if (button.dataset.action === 'remove') {
        wishlistSet.delete(productId);
        removedWishlistSet.add(productId);
      } else {
        wishlistSet.add(productId);
        removedWishlistSet.delete(productId);
      }
      renderRows();
    }
  });

  loadMoreButtonEl.addEventListener('click', function () {
    productsCount = Math.min(productsCount + 5, products.length);
    renderRows();
  });

  // Initial render on load
  renderRows();
}

export { renderProductsList };
