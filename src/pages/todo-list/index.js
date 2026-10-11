import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderTodoList(container) {
  container.innerHTML = `
    <form class="form" id="todo-form">
      <label for="todo-input">New todo</label>
      <input class="input" id="todo-input" type="text" placeholder="Add your todo" />
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

  const inputEl = container.querySelector('#todo-input');
  const todoListEl = container.querySelector('#todoList');
  const todoFormEl = container.querySelector('#todo-form');

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
    }
  }
}

export { renderTodoList };
