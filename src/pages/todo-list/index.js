import './index.css';
import '../../shared/styles/notification.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderTodoList(container) {
  container.innerHTML = `
  <div class="notification" id="notification" role="alert" data-notification-type=""></div>
    <form class="form" id="todoForm">
      <label for="todoInput">New todo</label>
      <input class="input" id="todoInput" type="text" placeholder="Add your todo" />
      <div class="form-actions">
        <button class="button button-primary" id="submit" type="submit">Submit</button>
      </div>
    </form>
      <ul id="todoList">
        <li>
          <span>Walk the dog</span>
          <button class="button" type="button">Delete</button>
        </li>
        <li>
          <span>Water the plants</span>
          <button class="button" type="button">Delete</button>
        </li>
        <li>
          <span>Wash the dishes</span>
          <button class="button" type="button">Delete</button>
        </li>
      </ul>
    `;

  const inputEl = container.querySelector('#todoInput');
  const todoListEl = container.querySelector('#todoList');
  const todoFormEl = container.querySelector('#todoForm');

  const notificationEl = container.querySelector('#notification');

  todoListEl.addEventListener('click', onTodoClick);
  todoFormEl.addEventListener('submit', addTodo);

  /** @param {MouseEvent} event */
  function onTodoClick(event) {
    const target = event.target;

    // Handle delete todo
    if (target instanceof HTMLButtonElement) {
      const li = event.target.closest('li');
      if (li) {
        li.remove();
        renderNotification('success', 'Todo deleted.');
      }
    }
  }

  /**
   * @param {SubmitEvent} event
   * @returns {void}
   */
  function addTodo(event) {
    event.preventDefault();
    const todoText = inputEl.value.trim();
    if (todoText) {
      const liEl = document.createElement('li');
      const spanEl = document.createElement('span');
      const deleteButtonEl = document.createElement('button');
      spanEl.textContent = todoText;
      deleteButtonEl.className = 'button';
      deleteButtonEl.type = 'button';
      deleteButtonEl.textContent = 'Delete';
      liEl.append(spanEl, deleteButtonEl);
      todoListEl.appendChild(liEl);
      inputEl.value = '';
      inputEl.focus();
      renderNotification('success', 'Todo added.');
    } else {
      renderNotification('error', 'Please enter a todo.');
    }
  }

  /**
   * @param {string} type
   * @param {string} message
   * @param {number} [duration]
   */
  function renderNotification(type, message, duration = 5000) {
    notificationEl.dataset.notificationType = type;
    notificationEl.textContent = message;
    if (type !== 'error') {
      setTimeout(() => {
        notificationEl.textContent = '';
        delete notificationEl.dataset.notificationType;
      }, duration);
    }
  }
}

export { renderTodoList };
