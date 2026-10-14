import {
  PROGRESS_BARS_DURATION_MS,
  PROGRESS_BARS_MAX_IN_PROGRESS,
} from '../../utils/constants';
import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderProgressBars(container) {
  container.innerHTML = `
    <button class="button button-primary" id="addProgressBarBtn" type="button">
      Add Progress Bar
    </button>
    <p class="progress-bars-status" aria-live="polite">
      Progress bars in progress:
      <span class="progress-bars-count">0</span>
      <span class="progress-bars-warning" hidden></span>
    </p>
    <div class="progress-bars"></div>
  `;

  const addProgressBarBtnEl = container.querySelector('#addProgressBarBtn');
  const progressBarsEl = container.querySelector('.progress-bars');
  const progressBarsCountEl = container.querySelector('.progress-bars-count');
  const warningEl = container.querySelector('.progress-bars-warning');

  /** @type {Array<() => void>} */
  const queue = [];
  let inProgressCount = 0;
  let isRunning = false;

  addProgressBarBtnEl.addEventListener('click', onAddProgressBarClick);

  /** @returns {void} */
  function renderProgressBarsQueueStatus() {
    const isLimitReached = inProgressCount >= PROGRESS_BARS_MAX_IN_PROGRESS;
    addProgressBarBtnEl.disabled = isLimitReached;
    progressBarsCountEl.textContent = String(inProgressCount);
    progressBarsCountEl.classList.toggle('active', inProgressCount > 0);
    warningEl.hidden = !isLimitReached;
    warningEl.textContent = '(limit reached)';
  }

  /** @returns {void} */
  function runNext() {
    const startNext = queue.shift();
    if (!startNext) {
      isRunning = false;
      return;
    }
    isRunning = true;
    startNext();
  }

  /** @returns {void} */
  function onAddProgressBarClick() {
    // Prevent adding more if max limit is reached
    if (inProgressCount >= PROGRESS_BARS_MAX_IN_PROGRESS) {
      return;
    }

    // Create new progress bar
    const progressBarContainerEl = document.createElement('div');
    progressBarContainerEl.className = 'progress-bar';
    progressBarContainerEl.setAttribute('role', 'progressbar');
    progressBarContainerEl.setAttribute('aria-label', 'Progress');
    progressBarContainerEl.setAttribute('aria-valuemin', '0');
    progressBarContainerEl.setAttribute('aria-valuemax', '100');
    progressBarContainerEl.setAttribute('aria-valuenow', '0');

    const progressBarFillEl = document.createElement('div');
    progressBarFillEl.className = 'progress-bar-fill';
    const progressBarLabelEl = document.createElement('span');
    progressBarLabelEl.className = 'progress-bar-label';
    progressBarLabelEl.textContent = '0%';
    progressBarContainerEl.append(progressBarFillEl, progressBarLabelEl);
    progressBarsEl.appendChild(progressBarContainerEl);

    inProgressCount += 1;
    renderProgressBarsQueueStatus();
    queue.push(startProgress);
    if (!isRunning) {
      runNext();
    }

    /** @returns {void} */
    function startProgress() {
      const startTime = performance.now();

      /**
       * @param {number} currentTime
       * @returns {void}
       */
      function updateProgress(currentTime) {
        const percent = Math.min(
          100,
          Math.max(
            0,
            Math.floor(
              ((currentTime - startTime) / PROGRESS_BARS_DURATION_MS) * 100
            )
          )
        );
        progressBarFillEl.style.width = `${percent}%`;
        progressBarLabelEl.textContent = `${percent}%`;
        progressBarContainerEl.setAttribute('aria-valuenow', String(percent));

        if (percent >= 100) {
          progressBarContainerEl.remove();
          inProgressCount -= 1;
          renderProgressBarsQueueStatus();
          runNext();
          return;
        }

        // Using requestAnimationFrame since rendering the progress bar should be updated smoothly with each repaint
        requestAnimationFrame(updateProgress);
      }

      requestAnimationFrame(updateProgress);
    }
  }
}

export { renderProgressBars };
