// Styles
import './app.css';
import './shared/styles/button.css';
import './shared/styles/form.css';
import './shared/styles/table.css';

import hljs from 'highlight.js/lib/core';
import cssLanguage from 'highlight.js/lib/languages/css';
import javascriptLanguage from 'highlight.js/lib/languages/javascript';
import { createSidebar } from './components/sidebar/index.js';
import { createTopbar } from './components/top-bar/index.js';
import { routes, pageRenderers } from './app.routes.js';
import { APP_NAME, ROUTES, STORAGE_KEYS } from './utils/constants.js';
import { createPageHeading } from './utils/helpers.js';

// Register languages for syntax highlighting
hljs.registerLanguage('css', cssLanguage);
hljs.registerLanguage('javascript', javascriptLanguage);

// Create main content and layout
const app = document.querySelector('#app');
const mainContent = document.createElement('main');
mainContent.className = 'main-content';
mainContent.innerHTML = `
  <div class="page-tabs" role="tablist" aria-label="Page view">
    <button class="page-tab active" id="tab-preview" type="button" role="tab" aria-selected="true" aria-controls="panel-preview" data-view="preview">Preview</button>
    <button class="page-tab" id="tab-js" type="button" role="tab" aria-selected="false" aria-controls="panel-js" tabindex="-1" data-view="js">JS</button>
    <button class="page-tab" id="tab-css" type="button" role="tab" aria-selected="false" aria-controls="panel-css" tabindex="-1" data-view="css">CSS</button>
  </div>
  <section class="page-view" id="panel-preview" role="tabpanel" aria-labelledby="tab-preview" tabindex="0" aria-live="polite"></section>
  <section class="source-panel" id="panel-js" role="tabpanel" aria-labelledby="tab-js" tabindex="0" hidden><pre><code></code></pre></section>
  <section class="source-panel" id="panel-css" role="tabpanel" aria-labelledby="tab-css" tabindex="0" hidden><pre><code></code></pre></section>
`;

const pageView = mainContent.querySelector('#panel-preview');
const tabList = mainContent.querySelector('[role="tablist"]');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
const tabPanels = [...mainContent.querySelectorAll('[role="tabpanel"]')];

const sidebar = createSidebar(routes);
const topbar = createTopbar();

const appLayout = document.createElement('div');
appLayout.className = 'app-layout';
appLayout.append(sidebar.element, mainContent);
app.replaceChildren(topbar.element, appLayout, sidebar.dialog);

// Attach event listeners for topbar buttons, hash changes, and tab interactions
topbar.menuButton.addEventListener('click', sidebar.openMenu);
topbar.themeButton.addEventListener('click', toggleTheme);
window.addEventListener('hashchange', renderCurrentRoute);
tabList.addEventListener('click', function (event) {
  const tab = event.target.closest('[role="tab"]');
  if (tab) activateTab(tab);
});
tabList.addEventListener('keydown', function (event) {
  const currentIndex = tabs.indexOf(document.activeElement);
  if (currentIndex < 0) return;

  let nextIndex;
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
  if (event.key === 'ArrowLeft')
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;
  if (nextIndex === undefined) return;

  event.preventDefault();
  tabs.at(nextIndex).focus();
  activateTab(tabs.at(nextIndex));
});

const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
let chosenTheme = localStorage.getItem(STORAGE_KEYS.THEME);
if (chosenTheme !== 'light' && chosenTheme !== 'dark') chosenTheme = null;
applyTheme(chosenTheme ?? (themePreference.matches ? 'dark' : 'light'));
themePreference.addEventListener('change', function (event) {
  if (!chosenTheme) applyTheme(event.matches ? 'dark' : 'light');
});

/**
 * @param {string} theme
 * @returns {void}
 */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  topbar.themeButton.textContent = theme === 'dark' ? '☀' : '☾';
  topbar.themeButton.setAttribute(
    'aria-label',
    `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
  );
  topbar.themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  topbar.themeButton.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
}

/** @returns {void} */
function toggleTheme() {
  chosenTheme =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEYS.THEME, chosenTheme);
  applyTheme(chosenTheme);
}

/**
 * @param {HTMLElement} selectedTab
 * @returns {void}
 */
function activateTab(selectedTab) {
  const selectedView = selectedTab.dataset.view;
  tabs.forEach((tab) => {
    const active = tab === selectedTab;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  tabPanels.forEach((panel) => {
    panel.hidden = panel.id !== `panel-${selectedView}`;
  });
}

// Render the current route and manage sidebar/page transitions
let renderRequestId = 0;

/** @returns {Promise<void>} */
async function renderCurrentRoute() {
  const currentRenderRequest = ++renderRequestId;
  const route = window.location.hash.replace(/^#\/?/, '');
  let pageId;
  let canonicalHash;

  if (route === '' || route === ROUTES.HOME.route) {
    pageId = ROUTES.HOME.route;
    canonicalHash = ROUTES.HOME.hash;
  } else if (routes.some((page) => page.route === route)) {
    pageId = route;
    canonicalHash = `#/${pageId}`;
  } else {
    pageId = ROUTES.NOT_FOUND.route;
  }

  if (canonicalHash && window.location.hash !== canonicalHash) {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}${canonicalHash}`
    );
  }

  // Update the sidebar to reflect the active page
  sidebar.setActive(pageId);
  const page = routes.find((item) => item.route === pageId);
  if (!page) {
    const pageTitle =
      pageId === ROUTES.HOME.route ? ROUTES.HOME.title : ROUTES.NOT_FOUND.title;
    document.title = `${APP_NAME} | ${pageTitle}`;
    tabList.hidden = true;
    activateTab(tabs[0]);
    const mountPage = await pageRenderers.get(pageId)();
    if (currentRenderRequest !== renderRequestId) return;
    mountPage(pageView);
    // Prepend the page heading to the page view
    const headingOverrides = new Map([
      [
        ROUTES.HOME.route,
        { eyebrow: ROUTES.HOME.title, title: `What is ${APP_NAME}?` },
      ],
      [ROUTES.NOT_FOUND.route, { eyebrow: '404' }],
    ]);
    pageView.prepend(createPageHeading(pageId, headingOverrides.get(pageId)));
    return;
  }

  document.title = `${APP_NAME} | ${page.title}`;
  tabList.hidden = false;
  activateTab(tabs[0]);
  const loadedPage = await page.render();
  if (currentRenderRequest !== renderRequestId) return;
  setHighlightedCode(
    mainContent.querySelector('#panel-js code'),
    loadedPage.javascript,
    'javascript'
  );
  setHighlightedCode(
    mainContent.querySelector('#panel-css code'),
    loadedPage.css,
    'css'
  );
  loadedPage.render(pageView);
  pageView.prepend(createPageHeading(page.route));
}

/**
 * @param {HTMLElement} codeElement
 * @param {string} source
 * @param {string} language
 * @returns {void}
 */
function setHighlightedCode(codeElement, source, language) {
  codeElement.textContent = source;
  codeElement.className = `language-${language}`;
  codeElement.removeAttribute('data-highlighted');
  hljs.highlightElement(codeElement);
}

/** @returns {void} */
function initializeRoute() {
  if (!window.location.hash) {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#/`
    );
  }
  renderCurrentRoute();
}

initializeRoute();
