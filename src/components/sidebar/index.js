import { APP_NAME, ROUTES } from '../../utils/constants.js';
import { getCurrentYear } from '../../utils/datetime.js';
import { padIndex } from '../../utils/helpers.js';
import './index.css';

/**
 * @param {import('../../index.d.js').Routes} routes
 * @returns {string}
 */
function pageLinks(routes) {
  return routes
    .map(
      (page, index) => `
        <a class="sidebar-link" href="#/${page.route}" data-page-id="${page.route}">
          <span>${padIndex(index)}</span>${page.title}
        </a>
      `
    )
    .join('');
}

/**
 * @param {import('../../index.d.js').Routes} routes
 * @returns {string}
 */
function sectionLinks(routes) {
  return `
    <div class="sidebar-section">
      <h2 class="sidebar-section-title">Home</h2>
      <a class="sidebar-link" href="${ROUTES.HOME.hash}" data-page-id="${ROUTES.HOME.route}">What is ${APP_NAME}</a>
    </div>
    <div class="sidebar-section">
      <h2 class="sidebar-section-title">Demos</h2>
      ${pageLinks(routes)}
    </div>
  `;
}

/**
 * @param {import('../../index.d.js').Routes} routes
 * @returns {{element: HTMLElement, dialog: HTMLDialogElement, setActive: (pageId: string) => void, openMenu: () => void}}
 */
function createSidebar(routes) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <nav class="sidebar-navigation" aria-label="Page navigation">
      ${sectionLinks(routes)}
    </nav>
    <div class="sidebar-footer"><span class="status-dot"></span> @${getCurrentYear()} ${APP_NAME}</div>
  `;

  const dialog = document.createElement('dialog');
  dialog.className = 'mobile-page-dialog';
  dialog.setAttribute('aria-labelledby', 'mobile-menu-title');
  dialog.innerHTML = `
    <div class="mobile-menu-header">
      <h2 id="mobile-menu-title">Browse</h2>
      <button class="dialog-close" type="button" aria-label="Close menu">×</button>
    </div>
    <nav class="mobile-menu-navigation" aria-label="Page navigation">
      ${sectionLinks(routes)}
    </nav>
  `;

  /**
   * @param {string} pageId
   * @returns {void}
   */
  function setActive(pageId) {
    [sidebar, dialog].forEach((navigation) => {
      navigation.querySelectorAll('[data-page-id]').forEach((link) => {
        const active = link.dataset.pageId === pageId;
        link.classList.toggle('active', active);
        if (active) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }

  /**
   * @returns {void}
   */
  function onCloseClick() {
    dialog.close();
  }

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  function onDialogClick(event) {
    if (event.target === dialog) dialog.close();
    if (event.target.closest('[data-page-id]')) dialog.close();
  }

  const closeButton = dialog.querySelector('.dialog-close');
  closeButton.addEventListener('click', onCloseClick);
  dialog.addEventListener('click', onDialogClick);

  return {
    element: sidebar,
    dialog,
    setActive,
    openMenu: () => dialog.showModal(),
  };
}
export { createSidebar };
