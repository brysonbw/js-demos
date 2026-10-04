import { ROUTES } from '../../utils/constants.js';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderNotFound(container) {
  container.innerHTML = `
     <header class="page-heading">
      <p class="eyebrow">404</p>
      <h1 id="page-title">Page not found</h1>
      <p>The page you requested does not exist.</p>
      <p><a class="button button-primary" href="${ROUTES.HOME.hash}">Go To Home</a></p>
    </header>
  `;
}
export { renderNotFound };
