const APP_NAME = import.meta.env.VITE_APP_NAME || 'JS Demos';

const GITHUB_REPO_URL = 'https://github.com/brysonbw/js-demos';

const STORAGE_KEY_NAMESPACE = APP_NAME.toLowerCase().replace(/\s+/g, '-');

const STORAGE_KEYS = Object.freeze({
  THEME: `${STORAGE_KEY_NAMESPACE}-theme`,
});

const ROUTES = Object.freeze({
  HOME: Object.freeze({
    route: 'home',
    title: 'Home',
    description:
      'A collection of practical, browser-based JavaScript examples — each one built in just JavaScript, no frameworks.',
    hash: '#/',
  }),
  NOT_FOUND: Object.freeze({
    route: 'not-found',
    title: 'Page not found',
    description: 'The page you requested does not exist.',
  }),
  CONTACT: Object.freeze({
    route: 'contact',
    title: 'Contact Form',
    description:
      'Add a new contact using the form below — with client-side validation, inline notifications, and a contacts table that updates dynamically.',
    hash: '#/contact',
  }),
  TODO_LIST: Object.freeze({
    route: 'todo-list',
    title: 'Todo List',
    description: 'Add and remove tasks locally in your browser.',
    hash: '#/todo-list',
  }),
  ACCORDION: Object.freeze({
    route: 'accordion',
    title: 'Accordion',
    description:
      'Expand and collapse sections of content, with each item toggling independently.',
    hash: '#/accordion',
  }),
  TABS: Object.freeze({
    route: 'tabs',
    title: 'Tabs',
    description:
      'Switch between panels of content using tabs, with one panel active at a time.',
    hash: '#/tabs',
  }),
  PRODUCTS_LIST: Object.freeze({
    route: 'products-list',
    title: 'Products List',
    description:
      'View a list of products, with options to add or remove items to your wishlist.',
    hash: '#/products-list',
  }),
  IMAGE_CAROUSEL: Object.freeze({
    route: 'image-carousel',
    title: 'Image Carousel',
    description:
      'Browse through a collection of images using the carousel navigation.',
    hash: '#/image-carousel',
  }),
  LIKE_BUTTON: Object.freeze({
    route: 'like-button',
    title: 'Like Button',
    description:
      'Interact with a like button component that toggles its state when clicked.',
    hash: '#/like-button',
  }),
});

// Ordered list of demo pages - position determines the demo number display/text
const DEMO_LIST_ORDER = Object.freeze([
  ROUTES.CONTACT,
  ROUTES.TODO_LIST,
  ROUTES.ACCORDION,
  ROUTES.TABS,
  ROUTES.PRODUCTS_LIST,
  ROUTES.IMAGE_CAROUSEL,
  ROUTES.LIKE_BUTTON,
]);

export {
  APP_NAME,
  DEMO_LIST_ORDER,
  ROUTES,
  STORAGE_KEYS,
  STORAGE_KEY_NAMESPACE,
  GITHUB_REPO_URL,
};
