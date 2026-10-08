import { ROUTES } from '../../utils/constants.js';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderNotFound(container) {
  container.innerHTML = `
    <p><a class="button button-primary" href="${ROUTES.HOME.hash}">Go To Home</a></p>
  `;
}
export { renderNotFound };
