import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderLikeButton(container) {
  container.innerHTML = `
    <button
      id="likeButton"
      class="button"
      type="button"
      aria-pressed="false"
    >
      <span>Like</span>
    </button>
  `;
  const likeButtonEl = container.querySelector('#likeButton');
  const labelEl = likeButtonEl.querySelector('span');

  let isLiked = false;

  likeButtonEl.addEventListener('click', onLikeButtonClick);

  /** @returns {void} */
  async function onLikeButtonClick() {
    likeButtonEl.disabled = true;
    labelEl.textContent = 'Loading...';
    isLiked = await toggleLikeButtonState(!isLiked);
    likeButtonEl.setAttribute('aria-pressed', String(isLiked));
    labelEl.textContent = isLiked ? 'Liked' : 'Like';
    likeButtonEl.disabled = false;
  }

  /**
   * Simulates an API call to toggle the like button state.
   * @param {boolean} nextState
   * @returns {Promise<boolean>}
   */
  function toggleLikeButtonState(nextState) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(nextState), 500);
    });
  }
}

export { renderLikeButton };
