import { ROUTES, GITHUB_REPO_URL } from '../../utils/constants.js';
import githubIcon from '../../assets/github.png';
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
        <a class="github-link" href="${GITHUB_REPO_URL}" target="_blank" rel="noreferrer" aria-label="GitHub repository">
          <img src="${githubIcon}" alt="GitHub" width="24" height="24" />
          <span>Contribute</span>
        </a>
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
