import { APP_NAME, DEMO_LIST_ORDER, ROUTES } from '../../utils/constants.js';
import { getCurrentYear } from '../../utils/datetime.js';
import { getDemoNumber } from '../../utils/helpers.js';
import './index.css';

/**
 * @param {import('../../index.d.js').Routes} routes
 * @returns {string}
 */
function pageLinks(routes) {
  // Order by DEMO_LIST_ORDER regardless of routes order - unlisted routes go last
  const rank = (route) => {
    const index = DEMO_LIST_ORDER.findIndex((demo) => demo.route === route);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return [...routes]
    .sort((a, b) => rank(a.route) - rank(b.route))
    .map(
      (page) => `
        <a class="sidebar-link" href="#/${page.route}" data-page-id="${page.route}">
          <span>${getDemoNumber(page.route)}</span>${page.title}
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
  const sidebarEl = document.createElement('aside');
  sidebarEl.className = 'sidebar';
  sidebarEl.innerHTML = `
    <nav class="sidebar-navigation" aria-label="Page navigation">
      ${sectionLinks(routes)}
    </nav>
    <div class="sidebar-footer">@${getCurrentYear()} <a class="sidebar-footer-link" href="${ROUTES.HOME.hash}">${APP_NAME}</a>  <span>v${__APP_VERSION__}</span></div>
  `;

  const dialogEl = document.createElement('dialog');
  dialogEl.className = 'mobile-page-dialog';
  dialogEl.setAttribute('aria-labelledby', 'mobile-menu-title');
  dialogEl.innerHTML = `
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
    [sidebarEl, dialogEl].forEach((navigation) => {
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
    dialogEl.close();
  }

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  function onDialogClick(event) {
    if (event.target === dialogEl) dialogEl.close();
    if (event.target.closest('[data-page-id]')) dialogEl.close();
  }

  const closeButtonEl = dialogEl.querySelector('.dialog-close');
  closeButtonEl.addEventListener('click', onCloseClick);
  dialogEl.addEventListener('click', onDialogClick);

  return {
    element: sidebarEl,
    dialog: dialogEl,
    setActive,
    openMenu: () => dialogEl.showModal(),
  };
}
export { createSidebar };
