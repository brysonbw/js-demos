import './index.css';

const BUTTON_ELEMENTS = [
  {
    id: 'postsBtn1',
    postId: 1,
    label: 'Show Post 1 Content',
  },
  {
    id: 'postsBtn2',
    postId: 2,
    label: 'Show Post 2 Content',
  },
  {
    id: 'postsBtn3',
    postId: 3,
    label: 'Show Post 3 Content',
  },
];

const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderModal(container) {
  container.innerHTML = `
        <dialog class="dialog">
          <h2 class="dialog-title"></h2>
          <div class="dialog-content"></div>
          <div class="dialog-footer">
            <button class="button dialog-close-btn" autofocus>Close</button>
          </div>
        </dialog>
        <div class="posts-btn-container">
          ${BUTTON_ELEMENTS.map((button) => `<button class="posts-btn button" data-post-id="${button.postId}" id="${button.id}">${button.label}</button>`).join('')}
        </div>
        <div class="alert" role="alert" hidden></div>
    `;

  const dialogEl = container.querySelector('.dialog');
  const postsButtonEls = Array.from(container.querySelectorAll('.posts-btn'));
  const dialogCloseButtonEl = container.querySelector('.dialog-close-btn');
  const dialogTitleEl = container.querySelector('.dialog-title');
  const dialogContentEl = container.querySelector('.dialog-content');
  const alertEl = container.querySelector('.alert');

  /** @type {Map<number, object>} */
  const postsCache = new Map();

  dialogCloseButtonEl.addEventListener('click', function () {
    dialogEl.close();
  });

  for (const buttonEl of postsButtonEls) {
    if (buttonEl instanceof HTMLElement && buttonEl.dataset.postId) {
      buttonEl.addEventListener('click', onPostButtonClick);
    }
  }

  /**
   * @param {MouseEvent} event
   * @returns {Promise<void>}
   */
  async function onPostButtonClick(event) {
    const target = event.currentTarget;
    if (target instanceof HTMLElement && target.dataset.postId) {
      const postId = target.dataset.postId;
      const label = target.textContent;
      setLoadingState(true, target);
      try {
        const postData = await getPostById(Number(postId));
        dialogTitleEl.textContent = postData?.title ?? '';
        dialogContentEl.textContent =
          postData?.body ??
          `Unable to display post (${postId}) data. Please try again later.`;
        dialogEl.showModal();
      } catch (error) {
        renderAlert(error.message);
      } finally {
        target.textContent = label;
        setLoadingState(false, target);
      }
    }
  }

  /**
   * @param {boolean} isLoading
   * @param {HTMLElement} activeButtonEl
   */
  function setLoadingState(isLoading, activeButtonEl) {
    for (const buttonEl of postsButtonEls) {
      buttonEl.disabled = isLoading;
    }
    if (isLoading) {
      activeButtonEl.textContent = 'Loading...';
    }
  }

  /** @param {string} message */
  function renderAlert(message) {
    alertEl.textContent = message;
    alertEl.hidden = false;
  }

  /**
   * @param {number} postId
   * @returns {Promise<object>}
   */
  async function getPostById(postId) {
    if (postsCache.has(postId)) {
      return postsCache.get(postId);
    }

    const response = await fetch(`${POSTS_API_URL}/${postId}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch post (${postId}) data. Please try again later.`
      );
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error(
        `Post (${postId}) data not found. Please try again later.`
      );
    }

    postsCache.set(postId, data);

    return data;
  }
}

export { renderModal, POSTS_API_URL };
