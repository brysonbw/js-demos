import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderKanbanBoard } from './index.js';

describe('renderKanbanBoard', () => {
  let containerEl;

  beforeEach(() => {
    window.localStorage.clear();
    containerEl = document.createElement('div');
    renderKanbanBoard(containerEl);
  });

  it('renders the starter tasks in three columns', () => {
    expect(containerEl.querySelectorAll('.column')).toHaveLength(3);
    expect(containerEl.querySelectorAll('.card')).toHaveLength(5);
    expect(containerEl).toHaveTextContent('Map the onboarding flow');
    expect(containerEl).toHaveTextContent('Review spacing tokens');
    expect(containerEl).toHaveTextContent('Audit button contrast');
    expect(
      containerEl.querySelector('[aria-labelledby="headingInProgress"] .count')
    ).toHaveTextContent('2');
    expect(containerEl.querySelector('.delete')).toHaveAccessibleName(
      'Delete Map the onboarding flow'
    );
    expect(containerEl.querySelector('.delete')).toHaveTextContent('Delete');
    expect(
      containerEl
        .querySelector('.delete')
        .compareDocumentPosition(containerEl.querySelector('.move'))
    ).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  it('adds a task with its selected priority and saves the board', () => {
    const titleInputEl = containerEl.querySelector('#title');
    titleInputEl.value = 'Write release notes';
    containerEl.querySelector('#description').value = 'Cover the new workflow.';
    containerEl.querySelector('#priority').value = 'high';
    containerEl.querySelector('#dueDate').value = '2026-11-04';
    containerEl
      .querySelector('#kanbanForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    const newTask = containerEl.querySelector('.card:last-child');
    expect(newTask).toHaveTextContent('Write release notes');
    expect(newTask).toHaveTextContent('High priority');
    expect(newTask).toHaveTextContent('Cover the new workflow.');
    expect(
      JSON.parse(window.localStorage.getItem('js-demos-kanban-board'))
        .columns[0].tasks
    ).toHaveLength(3);
  });

  it('does not add a task with an empty title', () => {
    containerEl.querySelector('#title').value = '   ';
    containerEl
      .querySelector('#kanbanForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    expect(containerEl.querySelectorAll('.card')).toHaveLength(5);
    expect(containerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Enter a task name.'
    );
    expect(
      JSON.parse(window.localStorage.getItem('js-demos-kanban-board'))
    ).toBeNull();
  });

  it('rejects task input that exceeds its allowed length', () => {
    containerEl.querySelector('#title').value = 'a'.repeat(81);
    containerEl
      .querySelector('#kanbanForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    expect(containerEl.querySelectorAll('.card')).toHaveLength(5);
    expect(containerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Task names must be 80 characters or fewer.'
    );

    containerEl.querySelector('#title').value = 'Valid title';
    containerEl.querySelector('#description').value = 'a'.repeat(181);
    containerEl
      .querySelector('#kanbanForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    expect(containerEl.querySelectorAll('.card')).toHaveLength(5);
    expect(containerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Notes must be 180 characters or fewer.'
    );
  });

  it('rejects invalid priority values before adding a task', () => {
    containerEl.querySelector('#title').value = 'Valid title';
    containerEl.querySelector('#priority').value = 'urgent';
    containerEl
      .querySelector('#kanbanForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    expect(containerEl.querySelectorAll('.card')).toHaveLength(5);
    expect(containerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Choose a valid task priority.'
    );
  });

  it('restores the board from local storage on the next render', () => {
    const titleInputEl = containerEl.querySelector('#title');
    titleInputEl.value = 'Persist this task';
    containerEl
      .querySelector('#kanbanForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    const nextContainerEl = document.createElement('div');
    renderKanbanBoard(nextContainerEl);

    expect(nextContainerEl).toHaveTextContent('Persist this task');
    expect(nextContainerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Loaded your saved board'
    );
  });

  it('shows a helpful message and uses the starter board for invalid saved data', () => {
    window.localStorage.setItem('js-demos-kanban-board', '{ invalid json');
    const restoredContainerEl = document.createElement('div');

    expect(() => renderKanbanBoard(restoredContainerEl)).not.toThrow();
    expect(restoredContainerEl).toHaveTextContent('Map the onboarding flow');
    expect(
      restoredContainerEl.querySelector('#kanbanActions')
    ).toHaveTextContent('saved board could not be read');
  });

  it('moves tasks to in progress without a task limit', () => {
    const firstMoveEl = containerEl.querySelector(
      '[data-task-id="task-spec"] .move'
    );
    firstMoveEl.value = 'in-progress';
    firstMoveEl.dispatchEvent(new Event('change', { bubbles: true }));

    expect(
      containerEl.querySelector('[data-column-id="in-progress"]')
    ).toHaveTextContent('Map the onboarding flow');
    expect(
      containerEl.querySelector('[aria-labelledby="headingInProgress"] .count')
    ).toHaveTextContent('3');

    const secondMoveEl = containerEl.querySelector(
      '[data-task-id="task-copy"] .move'
    );
    secondMoveEl.value = 'in-progress';
    secondMoveEl.dispatchEvent(new Event('change', { bubbles: true }));

    expect(
      containerEl.querySelector('[data-column-id="in-progress"]')
    ).toHaveTextContent('Draft empty-state copy');
    expect(containerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Moved “Draft empty-state copy” to In progress.'
    );
    expect(
      containerEl.querySelector('[aria-labelledby="headingInProgress"] .count')
    ).toHaveTextContent('4');
  });

  it('accepts native drag and drop between columns', () => {
    const transfer = {
      effectAllowed: '',
      setData: vi.fn(),
      getData: vi.fn(() => 'task-spec'),
    };
    const dragStart = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStart, 'dataTransfer', { value: transfer });
    containerEl
      .querySelector('[data-task-id="task-spec"]')
      .dispatchEvent(dragStart);

    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', { value: transfer });
    containerEl.querySelector('[data-column-id="done"]').dispatchEvent(drop);

    expect(transfer.setData).toHaveBeenCalledWith('text/plain', 'task-spec');
    expect(
      containerEl.querySelector('[data-column-id="done"]')
    ).toHaveTextContent('Map the onboarding flow');
  });

  it('reorders tasks within a column without moving a task dropped onto itself', () => {
    const transfer = {
      effectAllowed: '',
      setData: vi.fn(),
      getData: vi.fn(() => 'task-spec'),
    };
    const dragStart = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStart, 'dataTransfer', { value: transfer });
    containerEl
      .querySelector('[data-task-id="task-spec"]')
      .dispatchEvent(dragStart);

    const dropAfter = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropAfter, 'dataTransfer', { value: transfer });
    containerEl
      .querySelector('[data-task-id="task-copy"]')
      .dispatchEvent(dropAfter);

    const todoListEl = containerEl.querySelector('[data-column-id="todo"]');
    expect(
      Array.from(todoListEl.querySelectorAll('.card')).map(
        (card) => card.dataset.taskId
      )
    ).toEqual(['task-copy', 'task-spec']);

    const reorderedCardEl = todoListEl.querySelector(
      '[data-task-id="task-spec"]'
    );
    const selfDrop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(selfDrop, 'dataTransfer', { value: transfer });
    reorderedCardEl.dispatchEvent(selfDrop);

    expect(
      Array.from(todoListEl.querySelectorAll('.card')).map(
        (card) => card.dataset.taskId
      )
    ).toEqual(['task-copy', 'task-spec']);
  });

  it('opens the edit dialog prefilled with the task values', () => {
    containerEl
      .querySelector('[data-task-id="task-spec"] [data-action="edit"]')
      .click();

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(containerEl.querySelector('#editTitle').value).toBe(
      'Map the onboarding flow'
    );
    expect(containerEl.querySelector('#editPriority').value).toBe('high');
  });

  it('saves edits to a task and persists the board', () => {
    containerEl
      .querySelector('[data-task-id="task-spec"] [data-action="edit"]')
      .click();
    containerEl.querySelector('#editTitle').value = 'Rewrite onboarding';
    containerEl.querySelector('#editDescription').value = 'Fresh notes.';
    containerEl.querySelector('#editPriority').value = 'low';
    containerEl.querySelector('#editDueDate').value = '2026-12-01';
    containerEl
      .querySelector('#editForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    const cardEl = containerEl.querySelector('[data-task-id="task-spec"]');
    expect(cardEl).toHaveTextContent('Rewrite onboarding');
    expect(cardEl).toHaveTextContent('Fresh notes.');
    expect(cardEl).toHaveTextContent('Low priority');
    expect(containerEl.querySelector('#kanbanActions')).toHaveTextContent(
      'Updated “Rewrite onboarding”.'
    );
    const saved = JSON.parse(
      window.localStorage.getItem('js-demos-kanban-board')
    );
    expect(
      saved.columns
        .flatMap((column) => column.tasks)
        .find((task) => task.id === 'task-spec').title
    ).toBe('Rewrite onboarding');
  });

  it('shows an error and keeps the task unchanged when an edit is invalid', () => {
    containerEl
      .querySelector('[data-task-id="task-spec"] [data-action="edit"]')
      .click();
    containerEl.querySelector('#editTitle').value = '   ';
    containerEl
      .querySelector('#editForm')
      .dispatchEvent(
        new SubmitEvent('submit', { bubbles: true, cancelable: true })
      );

    expect(containerEl.querySelector('#editError')).toHaveTextContent(
      'Enter a task name.'
    );
    expect(containerEl.querySelector('#editError').hidden).toBe(false);
    expect(
      containerEl.querySelector('[data-task-id="task-spec"]')
    ).toHaveTextContent('Map the onboarding flow');
  });
});
