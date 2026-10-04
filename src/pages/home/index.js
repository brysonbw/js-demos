import { APP_NAME } from '../../utils/constants.js';
import './index.css';

/**
 * @param {HTMLElement} container
 */
function renderHome(container) {
  container.innerHTML = `
    <header class="page-heading">
      <p class="eyebrow">Home</p>
      <h1 id="page-title">What is ${APP_NAME}?</h1>
      <p>A collection of practical, browser-based JavaScript examples — each one built in just JavaScript, no frameworks.</p>
    </header>
    <p class="home">Explore each page from the navigation.</p>
    <p class="home">Why just JavaScript? Frameworks come and go, but the platform endures. These demos are a reminder of how much you can do with just the browser's own APIs.</p>
  `;
}
export { renderHome };
