import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PROGRESS_BARS_MAX_IN_PROGRESS } from '../../utils/constants';
import { renderProgressBars } from './index.js';

describe('renderProgressBars', () => {
  let containerEl;
  let addProgressBarBtnEl;
  let progressBarsEl;

  beforeEach(() => {
    vi.useFakeTimers();
    containerEl = document.createElement('div');
    renderProgressBars(containerEl);
    addProgressBarBtnEl = containerEl.querySelector('#addProgressBarBtn');
    progressBarsEl = containerEl.querySelector('.progress-bars');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an Add Progress Bar button', () => {
    expect(addProgressBarBtnEl).toHaveTextContent('Add Progress Bar');
    expect(addProgressBarBtnEl).toHaveAttribute('type', 'button');
  });

  it('adds a progress bar starting at 0% when clicked', () => {
    addProgressBarBtnEl.click();

    const progressBarEl = progressBarsEl.querySelector('.progress-bar');
    expect(progressBarsEl.querySelectorAll('.progress-bar')).toHaveLength(1);
    expect(progressBarEl).toHaveAttribute('aria-valuenow', '0');
    expect(progressBarEl).toHaveTextContent('0%');
  });

  it('shows the percentage as the bar fills', async () => {
    addProgressBarBtnEl.click();
    await vi.advanceTimersByTimeAsync(1000);

    const progressBarEl = progressBarsEl.querySelector('.progress-bar');
    expect(progressBarEl).toHaveTextContent(/^(4[89]|5\d)%$/);
    expect(
      progressBarEl.querySelector('.progress-bar-fill').style.width
    ).toMatch(/^(4[89]|5\d)%$/);
  });

  it('removes the bar from the DOM after it completes', async () => {
    addProgressBarBtnEl.click();
    await vi.advanceTimersByTimeAsync(2100);

    expect(progressBarsEl.querySelectorAll('.progress-bar')).toHaveLength(0);
  });

  it('shows how many bars are in progress and decrements on completion', async () => {
    const statusEl = containerEl.querySelector('.progress-bars-status');
    const countEl = containerEl.querySelector('.progress-bars-count');
    expect(statusEl).toHaveTextContent('Progress bars in progress: 0');
    expect(countEl).not.toHaveClass('active');

    addProgressBarBtnEl.click();
    addProgressBarBtnEl.click();
    addProgressBarBtnEl.click();
    expect(statusEl).toHaveTextContent('Progress bars in progress: 3');
    expect(countEl).toHaveClass('active');

    await vi.advanceTimersByTimeAsync(2100);
    expect(statusEl).toHaveTextContent('Progress bars in progress: 2');

    await vi.advanceTimersByTimeAsync(2000);
    expect(statusEl).toHaveTextContent('Progress bars in progress: 1');

    await vi.advanceTimersByTimeAsync(2000);
    expect(statusEl).toHaveTextContent('Progress bars in progress: 0');
  });

  it('limits the number of bars in progress and re-enables Add as they complete', async () => {
    const statusEl = containerEl.querySelector('.progress-bars-status');

    for (let i = 0; i < PROGRESS_BARS_MAX_IN_PROGRESS; i++) {
      addProgressBarBtnEl.click();
    }
    expect(addProgressBarBtnEl).toBeDisabled();
    expect(containerEl.querySelector('.progress-bars-warning').hidden).toBe(
      false
    );
    expect(containerEl.querySelector('.progress-bars-count')).toHaveClass(
      'active'
    );
    expect(statusEl).toHaveTextContent('limit reached');

    addProgressBarBtnEl.dispatchEvent(new MouseEvent('click'));
    expect(progressBarsEl.querySelectorAll('.progress-bar')).toHaveLength(
      PROGRESS_BARS_MAX_IN_PROGRESS
    );

    await vi.advanceTimersByTimeAsync(2100);
    expect(addProgressBarBtnEl).toBeEnabled();
    expect(containerEl.querySelector('.progress-bars-warning').hidden).toBe(
      true
    );
  });

  it('fills queued bars one at a time', async () => {
    addProgressBarBtnEl.click();
    addProgressBarBtnEl.click();
    await vi.advanceTimersByTimeAsync(1000);

    const [firstEl, secondEl] =
      progressBarsEl.querySelectorAll('.progress-bar');
    expect(Number(firstEl.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
    expect(secondEl).toHaveAttribute('aria-valuenow', '0');

    await vi.advanceTimersByTimeAsync(1200);
    expect(progressBarsEl.querySelectorAll('.progress-bar')).toHaveLength(1);
    expect(
      Number(
        progressBarsEl
          .querySelector('.progress-bar')
          .getAttribute('aria-valuenow')
      )
    ).toBeGreaterThan(0);
  });
});
