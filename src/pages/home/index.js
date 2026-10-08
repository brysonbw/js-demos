import './index.css';

/**
 * @param {HTMLElement} container
 */
function renderHome(container) {
  container.innerHTML = `
    <div class="home">
      <div class="home-section">
        <h2>Why just JavaScript?</h2>
        <div>
          Frameworks come and go, but the platform endures. These demos are a
          reminder of how much you can do with just the browser's own APIs.
        </div>
      </div>
      <div class="home-section">
        <h2>Motivation</h2>
        <div>
          I built this as a way to learn in public while studying for frontend
          interviews. Some demos are also inspired by common frontend interview
          questions.
        </div>
      </div>
      <div class="home-section">
        <h2>Why does this exist?</h2>
        <div>
          This is a public reference I can return to for challenges, demos, and
          JavaScript techniques that may come up in interviews or whiteboarding
          exercises. It is also a place for others to contribute and find code
          examples for building components and widgets, from small essentials to
          more challenging projects.
        </div>
      </div>
    </div>
  `;
}
export { renderHome };
