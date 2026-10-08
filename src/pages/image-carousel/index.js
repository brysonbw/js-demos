import './index.css';
import imageCarousel1 from '../../assets/image-carousel-1.jpg';
import imageCarousel2 from '../../assets/image-carousel-2.jpg';
import imageCarousel3 from '../../assets/image-carousel-3.jpg';
import imageCarousel4 from '../../assets/image-carousel-4.jpg';
import imageCarousel5 from '../../assets/image-carousel-5.jpg';
import imageCarousel6 from '../../assets/image-carousel-6.jpg';

const IMAGES = [
  { src: imageCarousel1, alt: 'Forest' },
  { src: imageCarousel2, alt: 'Beach' },
  { src: imageCarousel3, alt: 'Yak' },
  { src: imageCarousel4, alt: 'Hay' },
  { src: imageCarousel5, alt: 'Plants' },
  { src: imageCarousel6, alt: 'Building' },
];

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderImageCarousel(container) {
  if (!IMAGES || IMAGES.length === 0) {
    container.innerHTML =
      '<p>No images to display. Please try again later.</p>';
    return;
  }

  container.innerHTML = `
    <div class="carousel-container">
      <div class="carousel-viewport">
        ${IMAGES.map(
          ({ src, alt }, index) => `
            <img
              src="${src}"
              alt="${alt}"
              class="carousel-image"
              ${index === 0 ? '' : 'hidden'}
            />
          `
        ).join('')}

        <button
          type="button"
          class="carousel-btn prev-btn"
          aria-label="Previous image"
        >&#10094;</button>

        <button
          type="button"
          class="carousel-btn next-btn"
          aria-label="Next image"
        >&#10095;</button>
      </div>

      <div class="carousel-dots" aria-label="Choose an image">
        ${IMAGES.map(
          ({ alt }, index) => `
            <button
              type="button"
              class="dot-btn ${index === 0 ? 'active' : ''}"
              data-index="${index}"
              aria-label="Show ${alt}"
              aria-current="${index === 0 ? 'true' : 'false'}"
            >${String(index + 1).padStart(2, '0')}</button>
          `
        ).join('')}
      </div>
    </div>
  `;

  const imageEls = Array.from(container.querySelectorAll('.carousel-image'));
  const dotButtonEls = Array.from(container.querySelectorAll('.dot-btn'));
  const previousButtonEl = container.querySelector('.prev-btn');
  const nextButtonEl = container.querySelector('.next-btn');

  let currentIndex = 0;

  previousButtonEl.addEventListener('click', function () {
    updateCarousel(currentIndex - 1);
  });

  nextButtonEl.addEventListener('click', function () {
    updateCarousel(currentIndex + 1);
  });

  dotButtonEls.forEach((dot) => {
    dot.addEventListener('click', function () {
      updateCarousel(Number(dot.dataset.index));
    });
  });

  /**
   * Updates the carousel to display the image at the specified index.
   * @param {number} index
   * @returns {void}
   */
  function updateCarousel(index) {
    // Using the modulo operation to make sure index is always within the valid range.
    currentIndex = (index + IMAGES.length) % IMAGES.length;

    // Hide all images except the current one.
    for (const [index, image] of imageEls.entries()) {
      image.hidden = index !== currentIndex;
    }

    // Update the active state of the dot buttons to reflect the current image.
    for (const [index, dot] of dotButtonEls.entries()) {
      const isActive = index === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    }
  }
}

export { renderImageCarousel };
