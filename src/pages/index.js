import { ROUTES } from '../utils/constants.js';

/**
 * @param {Promise<Record<string, function(): void>>} modulePromise
 * @param {Promise<{ default: string }>} javascriptPromise
 * @param {Array<Promise<{ default: string }>>} cssPromises
 * @param {function(Record<string, function(): void>): function(): void} resolveRender
 * @returns {Promise<{ render: function(): void, javascript: string, css: string }>}
 */
async function renderPage(
  modulePromise,
  javascriptPromise,
  cssPromises,
  resolveRender
) {
  const [module, { default: javascript }, ...cssModules] = await Promise.all([
    modulePromise,
    javascriptPromise,
    ...cssPromises,
  ]);

  return {
    render: resolveRender(module),
    javascript,
    css: cssModules.map((cssModule) => cssModule.default).join('\n\n'),
  };
}

export const routes = [
  {
    route: ROUTES.CONTACT.route,
    title: ROUTES.CONTACT.title,
    render: () =>
      renderPage(
        import('./contact-form/index.js'),
        import('./contact-form/index.js?raw'),
        [
          import('./contact-form/index.css?raw'),
          import('../shared/styles/form.css?raw'),
        ],
        (module) => module.renderContactForm
      ),
  },
  {
    route: ROUTES.TODO_LIST.route,
    title: ROUTES.TODO_LIST.title,
    render: () =>
      renderPage(
        import('./todo-list/index.js'),
        import('./todo-list/index.js?raw'),
        [
          import('./todo-list/index.css?raw'),
          import('../shared/styles/form.css?raw'),
        ],
        (module) => module.renderTodoList
      ),
  },
  {
    route: ROUTES.ACCORDION.route,
    title: ROUTES.ACCORDION.title,
    render: () =>
      renderPage(
        import('./accordion/index.js'),
        import('./accordion/index.js?raw'),
        [import('./accordion/index.css?raw')],
        (module) => module.renderAccordion
      ),
  },
  {
    route: ROUTES.TABS.route,
    title: ROUTES.TABS.title,
    render: () =>
      renderPage(
        import('./tabs/index.js'),
        import('./tabs/index.js?raw'),
        [import('./tabs/index.css?raw')],
        (module) => module.renderTabs
      ),
  },
];

export const pageRenderers = new Map([
  [
    ROUTES.HOME.route,
    () => import('./home/index.js').then(({ renderHome }) => renderHome),
  ],
  [
    ROUTES.NOT_FOUND.route,
    () =>
      import('./not-found/index.js').then(
        ({ renderNotFound }) => renderNotFound
      ),
  ],
]);
