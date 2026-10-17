import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { users } from '../../data/users.js';
import { renderDataTable } from './index.js';

const USERS_PER_PAGE = 5;
const API_DELAY_MS = 250;

describe('renderDataTable', () => {
  let containerEl;

  beforeEach(() => {
    vi.useFakeTimers();
    containerEl = document.createElement('div');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first page with its table headers and pagination buttons', () => {
    renderDataTable(containerEl);

    expect(containerEl.querySelectorAll('thead th')).toHaveLength(4);
    expect(containerEl.querySelectorAll('tbody tr')).toHaveLength(
      USERS_PER_PAGE
    );
    expect(containerEl.querySelector('tbody tr td')).toHaveTextContent('1');
    expect(containerEl.querySelector('.previous-btn')).toHaveTextContent(
      'Previous'
    );
    expect(containerEl.querySelector('.next-btn')).toHaveTextContent('Next');
    expect(
      containerEl.querySelectorAll('.pagination-button[type="button"]')
    ).toHaveLength(2);
    expect(containerEl.querySelector('.previous-btn')).toBeDisabled();
    expect(containerEl.querySelector('.next-btn')).toBeEnabled();
  });

  it('shows loading and disables both buttons while fetching a page', async () => {
    renderDataTable(containerEl);

    const previousButtonEl = containerEl.querySelector('.previous-btn');
    const nextButtonEl = containerEl.querySelector('.next-btn');
    nextButtonEl.click();

    expect(nextButtonEl).toHaveTextContent('Loading...');
    expect(previousButtonEl).toBeDisabled();
    expect(nextButtonEl).toBeDisabled();
    expect(containerEl.querySelector('tbody tr td')).toHaveTextContent('1');

    await vi.advanceTimersByTimeAsync(API_DELAY_MS - 1);
    expect(containerEl.querySelector('tbody tr td')).toHaveTextContent('1');

    await vi.advanceTimersByTimeAsync(1);

    expect(containerEl.querySelector('tbody tr td')).toHaveTextContent('6');
    expect(previousButtonEl).toBeEnabled();
    expect(nextButtonEl).toBeEnabled();
    expect(nextButtonEl).toHaveTextContent('Next');
  });

  it('uses cached pages without another loading delay', async () => {
    renderDataTable(containerEl);

    const previousButtonEl = containerEl.querySelector('.previous-btn');
    const nextButtonEl = containerEl.querySelector('.next-btn');
    nextButtonEl.click();
    await vi.advanceTimersByTimeAsync(API_DELAY_MS);

    previousButtonEl.click();
    expect(containerEl.querySelector('tbody tr td')).toHaveTextContent('1');
    nextButtonEl.click();

    expect(containerEl.querySelector('tbody tr td')).toHaveTextContent('6');
    expect(nextButtonEl).toBeEnabled();
    expect(nextButtonEl).toHaveTextContent('Next');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('disables Next on the final page and renders the remaining users', async () => {
    renderDataTable(containerEl);

    const nextButtonEl = containerEl.querySelector('.next-btn');
    const previousButtonEl = containerEl.querySelector('.previous-btn');
    const pageCount = Math.ceil(users.length / USERS_PER_PAGE);

    for (let page = 1; page < pageCount; page += 1) {
      nextButtonEl.click();
      await vi.advanceTimersByTimeAsync(API_DELAY_MS);
    }

    expect(nextButtonEl).toBeDisabled();
    expect(previousButtonEl).toBeEnabled();
    expect(containerEl.querySelectorAll('tbody tr')).toHaveLength(
      users.length % USERS_PER_PAGE || USERS_PER_PAGE
    );
    expect(
      containerEl.querySelector('tbody tr:last-child td:first-child')
    ).toHaveTextContent(String(users.at(-1).id));
  });

  it('rejects a non-element container', () => {
    expect(() => renderDataTable(null)).toThrow(
      'A valid container element is required.'
    );
  });
});
