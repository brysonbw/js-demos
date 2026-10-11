import { beforeEach, describe, expect, it } from 'vitest';

import { renderTodoList } from './index.js';

function submitTodo(container, text) {
  container.querySelector('#todo-input').value = text;
  container
    .querySelector('#todo-form')
    .dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
}

describe('renderTodoList', () => {
  let containerEl;

  beforeEach(() => {
    containerEl = document.createElement('div');
    renderTodoList(containerEl);
  });

  it('renders three seed todos', () => {
    expect(containerEl.querySelectorAll('#todoList li')).toHaveLength(3);
  });

  it('adds a todo on submit', () => {
    submitTodo(containerEl, 'Buy milk');

    const itemEls = containerEl.querySelectorAll('#todoList li');
    expect(itemEls).toHaveLength(4);
    expect(itemEls[3].textContent).toContain('Buy milk');
  });

  it('clears the input after adding a todo', () => {
    submitTodo(containerEl, 'Buy milk');
    expect(containerEl.querySelector('#todo-input').value).toBe('');
  });

  it('does not add an empty todo', () => {
    submitTodo(containerEl, '   ');
    expect(containerEl.querySelectorAll('#todoList li')).toHaveLength(3);
  });

  it('deletes a todo when its delete button is clicked', () => {
    const firstDeleteButtonEl = containerEl.querySelector(
      '#todoList li button'
    );
    firstDeleteButtonEl.click();

    const itemEls = containerEl.querySelectorAll('#todoList li');
    expect(itemEls).toHaveLength(2);
    expect(containerEl.textContent).not.toContain('Walk the dog');
  });
});
