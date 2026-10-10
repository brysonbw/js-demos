import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderLikeButton } from './index.js';

describe('renderLikeButton', () => {
  let likeButton;

  beforeEach(() => {
    vi.useFakeTimers();
    const container = document.createElement('div');
    renderLikeButton(container);
    likeButton = container.querySelector('#likeButton');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an unpressed "Like" button by default', () => {
    expect(likeButton).toHaveTextContent('Like');
    expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    expect(likeButton).toBeEnabled();
  });

  it('shows a disabled "Loading..." state while toggling', () => {
    likeButton.click();

    expect(likeButton).toHaveTextContent('Loading...');
    expect(likeButton).toBeDisabled();
    expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows "Liked" and pressed state after liking', async () => {
    likeButton.click();
    await vi.advanceTimersByTimeAsync(500);

    expect(likeButton).toHaveTextContent('Liked');
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    expect(likeButton).toBeEnabled();
  });

  it('returns to "Like" and unpressed state after unliking', async () => {
    likeButton.click();
    await vi.advanceTimersByTimeAsync(500);

    likeButton.click();
    expect(likeButton).toHaveTextContent('Loading...');
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    await vi.advanceTimersByTimeAsync(500);

    expect(likeButton).toHaveTextContent('Like');
    expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    expect(likeButton).toBeEnabled();
  });
});
