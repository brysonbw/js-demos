import './index.css';

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderTodoList(container) {
  container.innerHTML = `
    <header class="page-heading">
      <p class="eyebrow">Page 03</p>
      <h1 id="page-title">Todo List</h1>
      <p>Add and remove tasks locally in your browser.</p>
    </header>
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
  const todoForm = container.querySelector('#todo-form');

  todoListEl.addEventListener('click', onTodoClick);
  todoForm.addEventListener('submit', addTodo);

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
      const li = document.createElement('li');
      li.innerHTML = `
          <span>${todoText}</span>
          <button class="button" type="button">Delete</button>
        `;
      todoListEl.appendChild(li);
      inputEl.value = '';
      inputEl.focus();
    }
  }
}

export { renderTodoList };
