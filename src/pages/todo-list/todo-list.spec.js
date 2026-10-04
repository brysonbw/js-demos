import { beforeEach, describe, expect, it } from 'vitest';

import { renderTodoList } from './index.js';

function submitTodo(container, text) {
  container.querySelector('#todo-input').value = text;
  container
    .querySelector('#todo-form')
    .dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
}

describe('renderTodoList', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    renderTodoList(container);
  });

  it('renders three seed todos', () => {
    expect(container.querySelectorAll('#todoList li')).toHaveLength(3);
  });

  it('adds a todo on submit', () => {
    submitTodo(container, 'Buy milk');

    const items = container.querySelectorAll('#todoList li');
    expect(items).toHaveLength(4);
    expect(items[3].textContent).toContain('Buy milk');
  });

  it('clears the input after adding a todo', () => {
    submitTodo(container, 'Buy milk');
    expect(container.querySelector('#todo-input').value).toBe('');
  });

  it('does not add an empty todo', () => {
    submitTodo(container, '   ');
    expect(container.querySelectorAll('#todoList li')).toHaveLength(3);
  });

  it('deletes a todo when its delete button is clicked', () => {
    const firstDeleteButton = container.querySelector('#todoList li button');
    firstDeleteButton.click();

    const items = container.querySelectorAll('#todoList li');
    expect(items).toHaveLength(2);
    expect(container.textContent).not.toContain('Walk the dog');
  });
});
