import './index.css';
import { users } from '../../data/users.js';

const USERS_PER_PAGE = 5;
const API_DELAY_MS = 250;
const PAGE_COUNT = Math.ceil(users.length / USERS_PER_PAGE);

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderDataTable(container) {
  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Occupation</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div class="pagination">
      <button class="button pagination-button previous-btn" type="button">
        Previous
      </button>
      <button class="button pagination-button next-btn" type="button">
        Next
      </button>
    </div>
  `;

  const tbodyEl = container.querySelector('tbody');
  const previousButtonEl = container.querySelector('.previous-btn');
  const nextButtonEl = container.querySelector('.next-btn');

  let currentPage = 0;
  let isLoading = false;

  /** @type {Map<number, typeof users>} */
  const usersCache = new Map();
  const firstPageUsers = users.slice(0, USERS_PER_PAGE);
  usersCache.set(0, firstPageUsers);

  renderUsers(firstPageUsers);
  updatePaginationButtons();

  previousButtonEl.addEventListener('click', onPreviousButtonClick);
  nextButtonEl.addEventListener('click', onNextButtonClick);

  /** @returns {Promise<void>} */
  async function onPreviousButtonClick() {
    await loadPage(currentPage - 1);
  }

  /** @returns {Promise<void>} */
  async function onNextButtonClick() {
    await loadPage(currentPage + 1);
  }

  /**
   * @param {number} page
   * @returns {Promise<void>}
   */
  async function loadPage(page) {
    if (isLoading || page < 0 || page >= PAGE_COUNT) {
      return;
    }

    isLoading = true;
    const loadingButtonEl =
      page < currentPage ? previousButtonEl : nextButtonEl;
    loadingButtonEl.textContent = 'Loading...';
    updatePaginationButtons();

    try {
      let pageUsers = usersCache.get(page);
      if (!pageUsers) {
        pageUsers = await getUsersPage(page);
        usersCache.set(page, pageUsers);
      }

      renderUsers(pageUsers);
      currentPage = page;
    } finally {
      isLoading = false;
      previousButtonEl.textContent = 'Previous';
      nextButtonEl.textContent = 'Next';
      updatePaginationButtons();
    }
  }

  /**
   * @param {typeof users} pageUsers
   * @returns {void}
   */
  function renderUsers(pageUsers) {
    const rows = pageUsers.map(({ id, name, age, occupation }) => {
      const rowEl = document.createElement('tr');
      for (const value of [id, name, age, occupation]) {
        const cellEl = document.createElement('td');
        cellEl.textContent = String(value);
        rowEl.append(cellEl);
      }
      return rowEl;
    });
    tbodyEl.replaceChildren(...rows);
  }

  /** @returns {void} */
  function updatePaginationButtons() {
    previousButtonEl.disabled = isLoading || currentPage === 0;
    nextButtonEl.disabled = isLoading || currentPage === PAGE_COUNT - 1;
  }
}

/**
 * @param {number} page
 * @returns {Promise<typeof users>}
 */
function getUsersPage(page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * USERS_PER_PAGE;
      resolve(users.slice(start, start + USERS_PER_PAGE));
    }, API_DELAY_MS);
  });
}

export { renderDataTable };
