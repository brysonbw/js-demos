import { ROUTES } from './utils/constants.js';
import { stripModuleSyntax } from './utils/helpers.js';

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
    javascript: stripModuleSyntax(javascript),
    css: cssModules.map((cssModule) => cssModule.default).join('\n\n'),
  };
}

export const routes = [
  {
    route: ROUTES.CONTACT.route,
    title: ROUTES.CONTACT.title,
    render: () =>
      renderPage(
        import('./pages/contact-form/index.js'),
        import('./pages/contact-form/index.js?raw'),
        [
          import('./pages/contact-form/index.css?raw'),
          import('./shared/styles/form.css?raw'),
          import('./shared/styles/table.css?raw'),
        ],
        (module) => module.renderContactForm
      ),
  },
  {
    route: ROUTES.TODO_LIST.route,
    title: ROUTES.TODO_LIST.title,
    render: () =>
      renderPage(
        import('./pages/todo-list/index.js'),
        import('./pages/todo-list/index.js?raw'),
        [
          import('./pages/todo-list/index.css?raw'),
          import('./shared/styles/form.css?raw'),
        ],
        (module) => module.renderTodoList
      ),
  },
  {
    route: ROUTES.ACCORDION.route,
    title: ROUTES.ACCORDION.title,
    render: () =>
      renderPage(
        import('./pages/accordion/index.js'),
        import('./pages/accordion/index.js?raw'),
        [import('./pages/accordion/index.css?raw')],
        (module) => module.renderAccordion
      ),
  },
  {
    route: ROUTES.TABS.route,
    title: ROUTES.TABS.title,
    render: () =>
      renderPage(
        import('./pages/tabs/index.js'),
        import('./pages/tabs/index.js?raw'),
        [import('./pages/tabs/index.css?raw')],
        (module) => module.renderTabs
      ),
  },
  {
    route: ROUTES.PRODUCTS_LIST.route,
    title: ROUTES.PRODUCTS_LIST.title,
    render: () =>
      renderPage(
        import('./pages/products-list/index.js'),
        import('./pages/products-list/index.js?raw'),
        [
          import('./shared/styles/button.css?raw'),
          import('./shared/styles/table.css?raw'),
        ],
        (module) => module.renderProductsList
      ),
  },
  {
    route: ROUTES.IMAGE_CAROUSEL.route,
    title: ROUTES.IMAGE_CAROUSEL.title,
    render: () =>
      renderPage(
        import('./pages/image-carousel/index.js'),
        import('./pages/image-carousel/index.js?raw'),
        [import('./pages/image-carousel/index.css?raw')],
        (module) => module.renderImageCarousel
      ),
  },
];

export const pageRenderers = new Map([
  [
    ROUTES.HOME.route,
    () => import('./pages/home/index.js').then(({ renderHome }) => renderHome),
  ],
  [
    ROUTES.NOT_FOUND.route,
    () =>
      import('./pages/not-found/index.js').then(
        ({ renderNotFound }) => renderNotFound
      ),
  ],
]);
