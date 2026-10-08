import './index.css';

/**
 * @param {HTMLElement} container
 */
function renderHome(container) {
  container.innerHTML = `
    <p class="home">Explore each page from the navigation.</p>
    <p class="home">Why just JavaScript? Frameworks come and go, but the platform endures. These demos are a reminder of how much you can do with just the browser's own APIs.</p>
  `;
}
export { renderHome };
