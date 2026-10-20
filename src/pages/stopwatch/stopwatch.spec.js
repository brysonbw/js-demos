import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderStopwatch } from './index.js';

describe('renderStopwatch', () => {
  let containerEl;

  beforeEach(() => {
    vi.useFakeTimers();
    containerEl = document.createElement('div');
    renderStopwatch(containerEl);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders the initial time and controls', () => {
    expect(containerEl.querySelector('#time')).toHaveTextContent('00:00:00');
    expect(containerEl.querySelector('#start')).toHaveTextContent('Start');
    expect(containerEl.querySelector('#stop')).toHaveTextContent('Stop');
    expect(containerEl.querySelector('#reset')).toHaveTextContent('Reset');
  });

  it('updates the elapsed time after starting', () => {
    containerEl.querySelector('#start').click();

    vi.advanceTimersByTime(3000);

    expect(containerEl.querySelector('#time')).toHaveTextContent('00:00:03');
  });

  it('formats elapsed time with minutes and hours', () => {
    containerEl.querySelector('#start').click();

    vi.advanceTimersByTime(3661000);

    expect(containerEl.querySelector('#time')).toHaveTextContent('01:01:01');
  });

  it('does not create multiple timers when Start is clicked repeatedly', () => {
    const startButtonEl = containerEl.querySelector('#start');
    startButtonEl.click();
    startButtonEl.click();

    vi.advanceTimersByTime(1000);

    expect(containerEl.querySelector('#time')).toHaveTextContent('00:00:01');
  });

  it('stops updating the elapsed time when stopped', () => {
    containerEl.querySelector('#start').click();
    vi.advanceTimersByTime(2000);

    containerEl.querySelector('#stop').click();
    vi.advanceTimersByTime(3000);

    expect(containerEl.querySelector('#time')).toHaveTextContent('00:00:02');
  });

  it('resets the elapsed time and stops the timer', () => {
    containerEl.querySelector('#start').click();
    vi.advanceTimersByTime(2000);

    containerEl.querySelector('#reset').click();
    vi.advanceTimersByTime(3000);

    expect(containerEl.querySelector('#time')).toHaveTextContent('00:00:00');
  });
});
