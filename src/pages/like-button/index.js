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
  const likeButton = container.querySelector('#likeButton');
  const label = likeButton.querySelector('span');

  let isLiked = false;

  likeButton.addEventListener('click', onLikeButtonClick);

  /** @returns {void} */
  async function onLikeButtonClick() {
    likeButton.disabled = true;
    label.textContent = 'Loading...';
    isLiked = await toggleLikeButtonState(!isLiked);
    likeButton.setAttribute('aria-pressed', String(isLiked));
    label.textContent = isLiked ? 'Liked' : 'Like';
    likeButton.disabled = false;
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
