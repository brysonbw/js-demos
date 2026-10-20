import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderStopwatch(container) {
  container.innerHTML = `
    <div id="stopwatch">
      <span id="time">00:00:00</span>
      <button id="start">Start</button>
      <button id="stop">Stop</button>
      <button id="reset">Reset</button>
    </div>
  `;
  const timeEl = container.querySelector('#time');
  const startButtonEl = container.querySelector('#start');
  const stopButtonEl = container.querySelector('#stop');
  const resetButtonEl = container.querySelector('#reset');

  let timer = null;

  startButtonEl.addEventListener('click', onStartButtonClick);
  stopButtonEl.addEventListener('click', onStopButtonClick);
  resetButtonEl.addEventListener('click', onResetButtonClick);

  /** @returns {void} */
  function onStartButtonClick() {
    if (!timer) {
      let seconds = 0;
      timer = setInterval(() => {
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timeEl.textContent = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }
  }

  /** @returns {void} */
  function onStopButtonClick() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  /** @returns {void} */
  function onResetButtonClick() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    timeEl.textContent = '00:00:00';
  }
}

export { renderStopwatch };
