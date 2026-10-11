import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderModal, POSTS_API_URL } from './index.js';

const POST = { id: 1, title: 'Post title', body: 'Post body' };

function mockFetchOk(data = POST) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

async function clickAndFlush(button) {
  button.click();
  await vi.waitFor(() => {
    const dialogOpened =
      vi.mocked(HTMLDialogElement.prototype.showModal).mock.calls.length > 0;
    const alertShown = !document.querySelector('.alert').hasAttribute('hidden');
    expect(dialogOpened || alertShown).toBe(true);
  });
}

describe('renderModal', () => {
  let containerEl;

  beforeEach(() => {
    vi.clearAllMocks();
    containerEl = document.createElement('div');
    document.body.appendChild(containerEl);
    renderModal(containerEl);
  });

  afterEach(() => {
    containerEl.remove();
    vi.unstubAllGlobals();
  });

  it('renders three post buttons, a dialog, and a hidden alert', () => {
    expect(containerEl.querySelectorAll('.posts-btn')).toHaveLength(3);
    expect(containerEl.querySelector('.dialog')).toBeInTheDocument();
    expect(containerEl.querySelector('.alert')).toHaveAttribute('hidden');
  });

  it('fetches the post and opens the dialog with its content', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);

    await clickAndFlush(containerEl.querySelector('#postsBtn1'));

    expect(fetchMock).toHaveBeenCalledWith(`${POSTS_API_URL}/1`);
    expect(containerEl.querySelector('.dialog-title')).toHaveTextContent(
      'Post title'
    );
    expect(containerEl.querySelector('.dialog-content')).toHaveTextContent(
      'Post body'
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it.each([1, 2, 3])('button %i fetches its own post', async (postId) => {
    const fetchMock = mockFetchOk({ ...POST, id: postId });
    vi.stubGlobal('fetch', fetchMock);

    await clickAndFlush(containerEl.querySelector(`#postsBtn${postId}`));

    expect(fetchMock).toHaveBeenCalledWith(`${POSTS_API_URL}/${postId}`);
  });

  it('shows a fallback message when the post has no body', async () => {
    vi.stubGlobal('fetch', mockFetchOk({ id: 1, title: 'Only title' }));

    await clickAndFlush(containerEl.querySelector('#postsBtn1'));

    expect(containerEl.querySelector('.dialog-content')).toHaveTextContent(
      'Unable to display post (1) data'
    );
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog when the close button is clicked', () => {
    containerEl.querySelector('.dialog-close-btn').click();

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
  });

  it('caches fetched posts and does not refetch them', async () => {
    const fetchMock = mockFetchOk();
    vi.stubGlobal('fetch', fetchMock);
    const buttonEl = containerEl.querySelector('#postsBtn1');

    await clickAndFlush(buttonEl);
    buttonEl.click();
    await vi.waitFor(() =>
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(2)
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows an alert when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await clickAndFlush(containerEl.querySelector('#postsBtn2'));

    const alertEl = containerEl.querySelector('.alert');
    expect(alertEl).not.toHaveAttribute('hidden');
    expect(alertEl).toHaveTextContent('Failed to fetch post (2) data');
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it('shows an alert when the data is invalid', async () => {
    vi.stubGlobal('fetch', mockFetchOk(null));

    await clickAndFlush(containerEl.querySelector('#postsBtn3'));

    expect(containerEl.querySelector('.alert')).toHaveTextContent(
      'Post (3) data not found'
    );
  });

  it('does not cache failed requests', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, title: 'Only title' }),
      });
    vi.stubGlobal('fetch', fetchMock);
    const buttonEl = containerEl.querySelector('#postsBtn1');

    await clickAndFlush(buttonEl);
    buttonEl.click();
    await vi.waitFor(() =>
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1)
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('disables all buttons and shows loading on the clicked one while fetching', async () => {
    let resolveFetch;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
      )
    );
    const buttonEls = containerEl.querySelectorAll('.posts-btn');

    buttonEls[1].click();

    buttonEls.forEach((buttonEl) => expect(buttonEl).toBeDisabled());
    expect(buttonEls[1]).toHaveTextContent('Loading...');
    expect(buttonEls[0]).toHaveTextContent('Show Post 1 Content');

    resolveFetch({ ok: true, json: () => Promise.resolve(POST) });
    await vi.waitFor(() => expect(buttonEls[1]).toBeEnabled());

    buttonEls.forEach((buttonEl) => expect(buttonEl).toBeEnabled());
    expect(buttonEls[1]).toHaveTextContent('Show Post 2 Content');
  });

  it('re-enables the buttons after a failed fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const buttonEls = containerEl.querySelectorAll('.posts-btn');

    await clickAndFlush(buttonEls[0]);

    buttonEls.forEach((buttonEl) => expect(buttonEl).toBeEnabled());
    expect(buttonEls[0]).toHaveTextContent('Show Post 1 Content');
  });
});
