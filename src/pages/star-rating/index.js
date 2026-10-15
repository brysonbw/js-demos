import './index.css';

const MAX_RATING = 5;
const INITIAL_RATING = 0;

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderStarRating(container) {
  container.innerHTML = `
    <div class="star-rating" role="group" aria-label="Rate this item">
      ${Array.from({ length: MAX_RATING }, (_, index) => {
        const rating = index + 1;

        return `
          <button
            class="star"
            type="button"
            aria-label="${rating} out of ${MAX_RATING} stars"
            aria-pressed="${rating === INITIAL_RATING}"
            data-rating="${rating}"
          >★</button>
        `;
      }).join('')}
    </div>
    <p class="star-rating-value">
      ${INITIAL_RATING} out of ${MAX_RATING} stars
    </p>
  `;

  const starRatingEl = container.querySelector('.star-rating');
  const starButtonEls = Array.from(starRatingEl.querySelectorAll('.star'));
  const ratingValueEl = container.querySelector('.star-rating-value');

  let selectedRating = INITIAL_RATING;
  let previewRating = null;

  for (const starButtonEl of starButtonEls) {
    starButtonEl.addEventListener('click', onStarButtonClick);
    starButtonEl.addEventListener('mouseenter', onStarButtonPreview);
    starButtonEl.addEventListener('focus', onStarButtonPreview);
  }

  starRatingEl.addEventListener('mouseleave', onStarRatingMouseLeave);
  starRatingEl.addEventListener('focusout', onStarRatingFocusOut);

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  function onStarButtonClick(event) {
    selectedRating = Number(event.currentTarget.dataset.rating);
    previewRating = null;
    renderRating();
  }

  /**
   * @param {Event} event
   * @returns {void}
   */
  function onStarButtonPreview(event) {
    previewRating = Number(event.currentTarget.dataset.rating);
    renderRating();
  }

  /** @returns {void} */
  function onStarRatingMouseLeave() {
    previewRating = null;
    renderRating();
  }

  /**
   * @param {FocusEvent} event
   * @returns {void}
   */
  function onStarRatingFocusOut(event) {
    if (!starRatingEl.contains(event.relatedTarget)) {
      previewRating = null;
      renderRating();
    }
  }

  /** @returns {void} */
  function renderRating() {
    const displayedRating = previewRating ?? selectedRating;

    for (const starButtonEl of starButtonEls) {
      const rating = Number(starButtonEl.dataset.rating);
      const isSelected = rating === selectedRating;
      starButtonEl.classList.toggle('filled', rating <= displayedRating);
      starButtonEl.setAttribute('aria-pressed', String(isSelected));
    }

    ratingValueEl.textContent = `${selectedRating} out of ${MAX_RATING} stars`;
  }

  renderRating();
}

export { renderStarRating };
