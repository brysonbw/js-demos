import { DEMO_LIST_ORDER, ROUTES } from './constants.js';

/**
 * @param {number} index
 * @returns {string}
 */
function padIndex(index) {
  return String(index + 1).padStart(2, '0');
}

/**
 * @param {string} route
 * @returns {string}
 */
function getDemoNumber(route) {
  const index = DEMO_LIST_ORDER.findIndex((demo) => demo.route === route);
  return index === -1 ? '' : padIndex(index);
}

/**
 * Removes ES import statements (including multi-line and side-effect imports) and
 * `export`/`export default` keywords on declarations. Also, trims blank lines left at the top and bottom.
 * @param {string} source
 * @returns {string}
 */
function stripModuleSyntax(source) {
  return source
    .replace(/^import\s[^;]*;[^\S\n]*\n?/gm, '')
    .replace(/^export\s*\{[^}]*\}[^;\n]*;?[^\S\n]*\n?/gm, '')
    .replace(/^export\s+default\s+/gm, '')
    .replace(/^export\s+/gm, '')
    .replace(/^\s*\n/, '')
    .trimEnd()
    .concat('\n');
}

/**
 * Builds the shared heading for a page from its {@link ROUTES} entry. The eyebrow
 * defaults to the demo number and the title to the route title.
 * @param {string} route
 * @param {{ eyebrow?: string, title?: string }} [overrides]
 * @returns {HTMLElement}
 */
function createPageHeading(route, overrides = {}) {
  const entry = Object.values(ROUTES).find((item) => item.route === route);
  const header = document.createElement('header');
  header.className = 'page-heading';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = overrides.eyebrow ?? `Page ${getDemoNumber(route)}`;

  const title = document.createElement('h1');
  title.id = 'page-title';
  title.textContent = overrides.title ?? entry.title;

  const description = document.createElement('p');
  description.textContent = entry.description;

  header.append(eyebrow, title, description);
  return header;
}

export { createPageHeading, getDemoNumber, padIndex, stripModuleSyntax };
