const products = [
  { name: 'Product 1', id: 1, price: 100 },
  { name: 'Product 2', id: 2, price: 200 },
  { name: 'Product 3', id: 3, price: 300 },
  { name: 'Product 4', id: 4, price: 400 },
  { name: 'Product 5', id: 5, price: 500 },
  { name: 'Product 6', id: 6, price: 600 },
  { name: 'Product 7', id: 7, price: 700 },
  { name: 'Product 8', id: 8, price: 800 },
  { name: 'Product 9', id: 9, price: 900 },
  { name: 'Product 10', id: 10, price: 1000 },
  { name: 'Product 11', id: 11, price: 1100 },
  { name: 'Product 12', id: 12, price: 1200 },
  { name: 'Product 13', id: 13, price: 1300 },
  { name: 'Product 14', id: 14, price: 1400 },
  { name: 'Product 15', id: 15, price: 1500 },
  { name: 'Product 16', id: 16, price: 1600 },
  { name: 'Product 17', id: 17, price: 1700 },
  { name: 'Product 18', id: 18, price: 1800 },
  { name: 'Product 19', id: 19, price: 1900 },
  { name: 'Product 20', id: 20, price: 2000 },
  { name: 'Product 21', id: 21, price: 2100 },
  { name: 'Product 22', id: 22, price: 2200 },
  { name: 'Product 23', id: 23, price: 2300 },
  { name: 'Product 24', id: 24, price: 2400 },
  { name: 'Product 25', id: 25, price: 2500 },
  { name: 'Product 26', id: 26, price: 2600 },
  { name: 'Product 27', id: 27, price: 2700 },
  { name: 'Product 28', id: 28, price: 2800 },
  { name: 'Product 29', id: 29, price: 2900 },
  { name: 'Product 30', id: 30, price: 3000 },
];

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

  const tableBody = container.querySelector('#productsTableBody');
  const loadMoreBtn = container.querySelector('#loadMore');
  const productsCountDisplay = container.querySelector('#productsCount');

  /** @returns {void} */
  function renderRows() {
    const initialProducts = products.slice(0, productsCount);

    tableBody.innerHTML = initialProducts
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

    productsCountDisplay.textContent = `Showing ${initialProducts.length} of ${products.length} products`;

    // Hide button if all products are displayed
    if (productsCount >= products.length) {
      loadMoreBtn.style.display = 'none';
    }
  }

  // Event Delegation - Handle onClick for wishlist button
  tableBody.addEventListener('click', function (event) {
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

  loadMoreBtn.addEventListener('click', function () {
    productsCount = Math.min(productsCount + 5, products.length);
    renderRows();
  });

  // Initial render on load
  renderRows();
}

export { renderProductsList };
