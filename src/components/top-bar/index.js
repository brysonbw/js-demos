import { ROUTES, GITHUB_REPO_URL } from '../../utils/constants.js';
import './index.css';

/**
 * @returns {{element: HTMLElement, menuButton: HTMLButtonElement, themeButton: HTMLButtonElement}}
 */
function createTopbar() {
  const topbarEl = document.createElement('header');
  topbarEl.className = 'topbar';
  topbarEl.innerHTML = `
    <a class="brand" href="${ROUTES.HOME.hash}">JS <span>Demos</span></a>
    <div class="topbar-actions">
      <nav class="top-nav" aria-label="External links">
        <a href="${GITHUB_REPO_URL}" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
      <button class="theme-toggle" type="button" aria-label="Switch color mode"></button>
      <button class="mobile-menu-button" type="button" aria-label="Open page menu" aria-haspopup="dialog">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  return {
    element: topbarEl,
    menuButton: topbarEl.querySelector('.mobile-menu-button'),
    themeButton: topbarEl.querySelector('.theme-toggle'),
  };
}
export { createTopbar };
