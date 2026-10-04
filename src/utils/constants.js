const APP_NAME = import.meta.env.VITE_APP_NAME || 'JS Demos';

const GITHUB_REPO_URL = 'https://github.com/brysonbw/js-demos';

const STORAGE_KEY_NAMESPACE = APP_NAME.toLowerCase().replace(/\s+/g, '-');

const STORAGE_KEYS = Object.freeze({
  THEME: `${STORAGE_KEY_NAMESPACE}-theme`,
});

const ROUTES = Object.freeze({
  HOME: Object.freeze({ route: 'home', title: 'Home', hash: '#/' }),
  NOT_FOUND: Object.freeze({ route: 'not-found', title: 'Page not found' }),
  CONTACT: Object.freeze({
    route: 'contact',
    title: 'Contact form',
    hash: '#/contact',
  }),
  TODO_LIST: Object.freeze({
    route: 'todo-list',
    title: 'Todo List',
    hash: '#/todo-list',
  }),
  ACCORDION: Object.freeze({
    route: 'accordion',
    title: 'Accordion',
    hash: '#/accordion',
  }),
  TABS: Object.freeze({ route: 'tabs', title: 'Tabs', hash: '#/tabs' }),
});

export {
  APP_NAME,
  ROUTES,
  STORAGE_KEYS,
  STORAGE_KEY_NAMESPACE,
  GITHUB_REPO_URL,
};
