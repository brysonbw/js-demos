import { STORAGE_KEYS } from '../../utils/constants';
import { escapeHtml } from '../../utils/helpers';
import './index.css';

const PRIORITIES = ['low', 'medium', 'high'];
const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 180;
const BOARD_COLUMNS = [
  { id: 'todo', title: 'To do', headingId: 'headingTodo' },
  { id: 'in-progress', title: 'In progress', headingId: 'headingInProgress' },
  { id: 'done', title: 'Done', headingId: 'headingDone' },
];

/**
 * @param {HTMLElement} container
 * @returns {void}
 */
function renderKanbanBoard(container) {
  container.innerHTML = `
    <section class="kanban" aria-label="Kanban board">
      <form class="form" id="kanbanForm">
        <div class="form-heading">
          <div>
            <p class="eyebrow">Plan the work</p>
            <h2>Add a task</h2>
          </div>
        </div>
        <div class="form-fields">
          <label class="field field-title" for="title">
            <span>Title <span>*</span></span>
            <input
              class="input"
              id="title"
              name="title"
              type="text"
              maxlength="${TITLE_MAX_LENGTH}"
              placeholder="What needs to get done?"
              required
            />
          </label>
          <label class="field field-description" for="description">
            Notes
            <input
              class="input"
              id="description"
              name="description"
              type="text"
              maxlength="${DESCRIPTION_MAX_LENGTH}"
              placeholder="Add a little context"
            />
          </label>
          <label class="field" for="priority">
            Priority
            <select class="input" id="priority" name="priority">
              ${renderPriorityOptions('medium')}
            </select>
          </label>
          <label class="field" for="dueDate">
            Due date
            <input class="input" id="dueDate" name="dueDate" type="date" />
          </label>
          <button class="button button-primary add-button" type="submit">
            Add task
          </button>
        </div>
      </form>

      <div class="board" id="board" aria-label="Task columns"></div>

      <p class="status" id="kanbanActions" role="status" aria-live="polite">
        Drag a task to another column, or use its “Move to” menu.
      </p>

      <dialog class="dialog" id="editDialog" aria-labelledby="editDialogTitle">
        <h2 class="dialog-title" id="editDialogTitle">Edit task</h2>
        <form class="edit-form" id="editForm" novalidate>
          <label class="field" for="editTitle">
            <span>Title <span>*</span></span>
            <input class="input" id="editTitle" name="title" type="text" maxlength="${TITLE_MAX_LENGTH}" required />
          </label>
          <label class="field" for="editDescription">
            Notes
            <input class="input" id="editDescription" name="description" type="text" maxlength="${DESCRIPTION_MAX_LENGTH}" />
          </label>
          <label class="field" for="editPriority">
            Priority
            <select class="input" id="editPriority" name="priority">
              ${renderPriorityOptions('medium')}
            </select>
          </label>
          <label class="field" for="editDueDate">
            Due date
            <input class="input" id="editDueDate" name="dueDate" type="date" />
          </label>
          <p class="edit-error" id="editError" role="alert" hidden></p>
          <div class="dialog-footer">
            <button class="button" id="editCancel" type="button">Cancel</button>
            <button class="button button-primary" type="submit">Save changes</button>
          </div>
        </form>
      </dialog>
    </section>
  `;

  const boardEl = container.querySelector('#board');
  const kanbanFormEl = container.querySelector('#kanbanForm');

  const titleInputEl = container.querySelector('#title');
  const descriptionInputEl = container.querySelector('#description');
  const priorityInputEl = container.querySelector('#priority');
  const dueDateInputEl = container.querySelector('#dueDate');

  const kanbanActionsEl = container.querySelector('#kanbanActions');

  const editDialogEl = container.querySelector('#editDialog');
  const editFormEl = container.querySelector('#editForm');
  const editTitleInputEl = container.querySelector('#editTitle');
  const editDescriptionInputEl = container.querySelector('#editDescription');
  const editPriorityInputEl = container.querySelector('#editPriority');
  const editDueDateInputEl = container.querySelector('#editDueDate');
  const editErrorEl = container.querySelector('#editError');
  const editCancelButtonEl = container.querySelector('#editCancel');

  let columns = createInitialColumns();
  let nextTaskId = 0;
  let draggedTaskId = null;
  let editingTaskId = null;
  let editTriggerEl = null;

  columns = loadBoard(kanbanActionsEl);
  renderBoard();

  kanbanFormEl.addEventListener('submit', onAddTask);
  boardEl.addEventListener('click', onBoardClick);
  editFormEl.addEventListener('submit', onSaveEdit);
  editCancelButtonEl.addEventListener('click', onCancelEdit);
  editDialogEl.addEventListener('close', onEditDialogClose);
  boardEl.addEventListener('change', onBoardChange);
  boardEl.addEventListener('dragstart', onDragStart);
  boardEl.addEventListener('dragover', onDragOver);
  boardEl.addEventListener('drop', onDrop);
  boardEl.addEventListener('dragend', onDragEnd);
  boardEl.addEventListener('dragleave', onDragLeave);

  /**
   * @param {SubmitEvent} event
   * @returns {void}
   */
  function onAddTask(event) {
    event.preventDefault();
    const title = titleInputEl.value.trim();
    const description = descriptionInputEl.value.trim();
    const priority = priorityInputEl.value;
    const dueDate = dueDateInputEl.value;

    const error = validateTaskInput({ title, description, priority, dueDate });
    if (error) {
      kanbanActionsEl.textContent = error.message;
      const fieldEls = {
        title: titleInputEl,
        description: descriptionInputEl,
        priority: priorityInputEl,
        dueDate: dueDateInputEl,
      };
      fieldEls[error.field].focus();
      return;
    }

    columns[0].tasks.push({
      id: `task-${Date.now()}-${nextTaskId++}`,
      title,
      description,
      priority,
      dueDate,
      status: 'todo',
    });

    kanbanFormEl.reset();
    renderBoard();
    saveBoard(`Added “${title}” to To do.`);
    titleInputEl.focus();
  }

  /**
   * @param {MouseEvent} event
   * @returns {void}
   */
  function onBoardClick(event) {
    const buttonEl = event.target.closest('[data-action]');
    if (!buttonEl) {
      return;
    }

    const cardEl = buttonEl.closest('[data-task-id]');
    const column = columns.find((item) =>
      item.tasks.some((task) => task.id === cardEl.dataset.taskId)
    );
    const task = column?.tasks.find(
      (item) => item.id === cardEl.dataset.taskId
    );
    if (!column || !task) {
      return;
    }

    if (buttonEl.dataset.action === 'edit') {
      openEditDialog(task, buttonEl);
      return;
    }

    // Handle delete
    column.tasks = column.tasks.filter((item) => item.id !== task.id);
    renderBoard();
    saveBoard(`Deleted “${task.title}”.`);
  }

  /**
   * @param {import('../../index.d.js').KanbanTask} task
   * @param {HTMLElement} triggerEl
   * @returns {void}
   */
  function openEditDialog(task, triggerEl) {
    editingTaskId = task.id;
    editTriggerEl = triggerEl;
    editTitleInputEl.value = task.title;
    editDescriptionInputEl.value = task.description;
    editPriorityInputEl.value = task.priority;
    editDueDateInputEl.value = task.dueDate;
    editErrorEl.hidden = true;
    editErrorEl.textContent = '';
    editDialogEl.showModal();
    editTitleInputEl.focus();
  }

  /**
   * @param {SubmitEvent} event
   * @returns {void}
   */
  function onSaveEdit(event) {
    event.preventDefault();
    const task = columns
      .flatMap((column) => column.tasks)
      .find((item) => item.id === editingTaskId);
    if (!task) {
      editDialogEl.close();
      return;
    }

    const title = editTitleInputEl.value.trim();
    const description = editDescriptionInputEl.value.trim();
    const priority = editPriorityInputEl.value;
    const dueDate = editDueDateInputEl.value;

    const error = validateTaskInput({ title, description, priority, dueDate });
    if (error) {
      editErrorEl.textContent = error.message;
      editErrorEl.hidden = false;
      const fieldEls = {
        title: editTitleInputEl,
        description: editDescriptionInputEl,
        priority: editPriorityInputEl,
        dueDate: editDueDateInputEl,
      };
      fieldEls[error.field].focus();
      return;
    }

    task.title = title;
    task.description = description;
    task.priority = priority;
    task.dueDate = dueDate;
    editDialogEl.close();
    renderBoard();
    saveBoard(`Updated “${title}”.`);
  }

  /** @returns {void} */
  function onCancelEdit() {
    editDialogEl.close();
  }

  /** @returns {void} */
  function onEditDialogClose() {
    editingTaskId = null;
    const triggerEl = editTriggerEl;
    editTriggerEl = null;
    // The board re-renders after saving, so refocus the card's current edit button
    const taskId = triggerEl?.closest('[data-task-id]')?.dataset.taskId;
    const buttonEl = Array.from(
      boardEl.querySelectorAll('[data-action="edit"]')
    ).find((item) => item.closest('[data-task-id]')?.dataset.taskId === taskId);
    buttonEl?.focus();
  }

  /**
   * @param {Event} event
   * @returns {void}
   */
  function onBoardChange(event) {
    const selectEl = event.target.closest('.move');
    if (!selectEl) {
      return;
    }

    const taskId = selectEl.dataset.taskId;
    const destination = selectEl.value;
    const task = columns
      .flatMap((column) => column.tasks)
      .find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    if (moveTask(taskId, destination, null)) {
      const movedSelect = Array.from(boardEl.querySelectorAll('.move')).find(
        (item) => item.dataset.taskId === taskId
      );
      movedSelect?.focus();
    }
  }

  /**
   * @param {DragEvent} event
   * @returns {void}
   */
  function onDragStart(event) {
    const cardEl = event.target.closest('[data-task-id]');
    if (!cardEl || !event.dataTransfer) {
      return;
    }

    draggedTaskId = cardEl.dataset.taskId;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedTaskId);
    cardEl.classList.add('is-dragging');
  }

  /**
   * @param {DragEvent} event
   * @returns {void}
   */
  function onDragOver(event) {
    const listEl = event.target.closest('[data-column-id]');
    if (!listEl || !draggedTaskId) {
      return;
    }

    event.preventDefault(); // Required to allow dropping
    clearDropTargets();
    const targetCardEl = event.target.closest('[data-task-id]');
    if (!targetCardEl || targetCardEl.dataset.taskId === draggedTaskId) {
      listEl.classList.add('is-drop-target');
      return;
    }

    // Upper half of the hovered card = insert before it, lower half = after
    const bounds = targetCardEl.getBoundingClientRect();
    const insertBefore = event.clientY < bounds.top + bounds.height / 2;
    targetCardEl.classList.add(insertBefore ? 'drop-before' : 'drop-after');
  }

  /**
   * @param {DragEvent} event
   * @returns {void}
   */
  function onDrop(event) {
    const listEl = event.target.closest('[data-column-id]');
    const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId;
    if (!listEl || !taskId) {
      return;
    }

    event.preventDefault();
    // Dropping a card onto itself does nothing
    const targetCardEl = event.target.closest('[data-task-id]');
    if (targetCardEl?.dataset.taskId === taskId) {
      draggedTaskId = null;
      clearDropTargets();
      return;
    }

    // Card to insert in front of; null means the end of the column
    let beforeTaskId = null;

    if (targetCardEl) {
      const bounds = targetCardEl.getBoundingClientRect();
      const insertBefore = event.clientY < bounds.top + bounds.height / 2;
      if (insertBefore) {
        beforeTaskId = targetCardEl.dataset.taskId;
      } else {
        beforeTaskId = targetCardEl.nextElementSibling?.dataset.taskId ?? null;
      }
    }

    draggedTaskId = null;
    clearDropTargets();
    moveTask(taskId, listEl.dataset.columnId, beforeTaskId);
  }

  /** @returns {void} */
  function onDragEnd() {
    draggedTaskId = null;
    clearDropTargets();
    boardEl.querySelector('.is-dragging')?.classList.remove('is-dragging');
  }

  /**
   * @param {DragEvent} event
   * @returns {void}
   */
  function onDragLeave(event) {
    if (event.target === boardEl) {
      clearDropTargets();
    }
  }

  /**
   * @param {string} taskId
   * @param {string} destinationId
   * @param {?string} beforeTaskId
   * @returns {boolean} false if nothing changed
   */
  function moveTask(taskId, destinationId, beforeTaskId) {
    const source = columns.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
    const destination = columns.find((column) => column.id === destinationId);
    const task = source?.tasks.find((item) => item.id === taskId);
    if (!source || !destination || !task) {
      return false;
    }

    const sourceIndex = source.tasks.indexOf(task);
    let destinationIndex = beforeTaskId
      ? destination.tasks.findIndex((item) => item.id === beforeTaskId)
      : destination.tasks.length;
    if (destinationIndex < 0) {
      destinationIndex = destination.tasks.length;
    }

    if (source === destination && beforeTaskId === taskId) {
      return false;
    }

    source.tasks.splice(sourceIndex, 1);
    // Reordering within one column
    if (source === destination && sourceIndex < destinationIndex) {
      destinationIndex--;
    }
    task.status = destination.id;
    destination.tasks.splice(destinationIndex, 0, task);

    renderBoard();
    saveBoard(`Moved “${task.title}” to ${destination.title}.`);
    return true;
  }

  /** @returns {void} */
  function renderBoard() {
    boardEl.innerHTML = BOARD_COLUMNS.map((definition) => {
      const column = columns.find((item) => item.id === definition.id);
      const tasksMarkup = column.tasks.map(renderTask).join('');

      return `
        <section class="column" aria-labelledby="${definition.headingId}">
          <header class="column-header">
            <h2 id="${definition.headingId}">${definition.title}</h2>
            <span class="count" aria-label="${column.tasks.length} tasks">${column.tasks.length}</span>
          </header>
          <ol class="tasks" data-column-id="${definition.id}" aria-label="${definition.title} tasks">
            ${tasksMarkup || '<li class="empty">Drop a task here</li>'}
          </ol>
        </section>
      `;
    }).join('');
  }

  /**
   * Renders a single task card.
   * @param {import('../../index.d.js').KanbanTask} task
   * @returns {string}
   */
  function renderTask(task) {
    const priorityLabel =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    const dueDateMarkup = task.dueDate
      ? `<span class="due">${formatDueDate(task.dueDate)}</span>`
      : '';
    const descriptionMarkup = task.description
      ? `<p class="task-description">${escapeHtml(task.description)}</p>`
      : '';
    const moveOptions = BOARD_COLUMNS.map(
      ({ id, title }) =>
        `<option value="${id}" ${task.status === id ? 'selected' : ''}>${title}</option>`
    ).join('');

    return `
      <li class="card" data-task-id="${escapeHtml(task.id)}" draggable="true">
        <div class="card-top">
          <span class="priority priority-${task.priority}">${priorityLabel} priority</span>
          ${dueDateMarkup}
        </div>
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        ${descriptionMarkup}
        <div class="card-actions">
          <label class="move-label">
            <span class="visually-hidden">Move “${escapeHtml(task.title)}” to</span>
            <select class="move" data-task-id="${escapeHtml(task.id)}">
              ${moveOptions}
            </select>
          </label>
          <div class="card-buttons">
            <button class="edit" type="button" data-action="edit" aria-label="Edit ${escapeHtml(task.title)}" title="Edit task">
              Edit
            </button>
            <button class="delete" type="button" data-action="delete" aria-label="Delete ${escapeHtml(task.title)}" title="Delete task">
              Delete
            </button>
          </div>
        </div>
      </li>
    `;
  }

  /** @returns {void} */
  function clearDropTargets() {
    boardEl
      .querySelectorAll('.is-drop-target, .drop-before, .drop-after')
      .forEach((element) =>
        element.classList.remove('is-drop-target', 'drop-before', 'drop-after')
      );
  }

  /**
   * Saves the current state of the board to localStorage and displays a message.
   * @param {string} message
   * @returns {void}
   */
  function saveBoard(message) {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.KANBAN_BOARD,
        JSON.stringify({ version: 1, columns })
      );
      kanbanActionsEl.textContent = message;
    } catch (error) {
      kanbanActionsEl.textContent = `Board changed, but could not be saved in this browser: ${getErrorMessage(error)}`;
    }
  }
}

/**
 * Loads the saved board from localStorage or returns the initial columns if none are found or if there is an error.
 * @param {HTMLElement} kanbanActionsEl
 * @returns {import('../../index.d.js').KanbanTasks}
 */
function loadBoard(kanbanActionsEl) {
  let savedBoard;
  try {
    savedBoard = window.localStorage.getItem(STORAGE_KEYS.KANBAN_BOARD);
  } catch (error) {
    kanbanActionsEl.textContent = `Could not load the saved board: ${getErrorMessage(error)}`;
    return createInitialColumns();
  }

  if (!savedBoard) {
    return createInitialColumns();
  }

  let parsedBoard;
  try {
    parsedBoard = JSON.parse(savedBoard);
  } catch {
    kanbanActionsEl.textContent =
      'The saved board could not be read. Showing the starter board.';
    return createInitialColumns();
  }

  const restoredColumns = restoreColumns(parsedBoard);
  if (!restoredColumns) {
    kanbanActionsEl.textContent =
      'The saved board has an invalid format. Showing the starter board.';
    return createInitialColumns();
  }

  kanbanActionsEl.textContent = 'Loaded your saved board from this browser.';
  return restoredColumns;
}

/**
 * Restores the columns from a saved board value, or returns null if the value is invalid.
 * @param {unknown} value
 * @returns {import('../../index.d.js').KanbanTasks|null}
 */
function restoreColumns(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    value.version !== 1 ||
    !Array.isArray(value.columns) ||
    value.columns.length !== BOARD_COLUMNS.length
  ) {
    return null;
  }

  const ids = new Set();
  const restoredColumns = [];
  for (const definition of BOARD_COLUMNS) {
    const savedColumn = value.columns.find(
      (column) =>
        column !== null &&
        typeof column === 'object' &&
        column.id === definition.id
    );
    if (!savedColumn || !Array.isArray(savedColumn.tasks)) {
      return null;
    }

    const tasks = [];
    for (const task of savedColumn.tasks) {
      if (!isValidTask(task) || ids.has(task.id)) {
        return null;
      }
      ids.add(task.id);
      tasks.push({ ...task, status: definition.id });
    }
    restoredColumns.push({ ...definition, tasks });
  }

  return restoredColumns;
}

/** @returns {import('../../index.d.js').KanbanTasks} */
function createInitialColumns() {
  return [
    {
      ...BOARD_COLUMNS[0],
      tasks: [
        {
          id: 'task-spec',
          title: 'Map the onboarding flow',
          description: 'List the screens a first-time user will visit.',
          priority: 'high',
          dueDate: '2026-10-28',
          status: 'todo',
        },
        {
          id: 'task-copy',
          title: 'Draft empty-state copy',
          description: 'Keep the first-run experience friendly and clear.',
          priority: 'medium',
          dueDate: '',
          status: 'todo',
        },
      ],
    },
    {
      ...BOARD_COLUMNS[1],
      tasks: [
        {
          id: 'task-tokens',
          title: 'Review spacing tokens',
          description: 'Check the settings and profile screens.',
          priority: 'high',
          dueDate: '2026-10-25',
          status: 'in-progress',
        },
        {
          id: 'task-tests',
          title: 'Add keyboard navigation tests',
          description: 'Cover focus order and visible focus styles.',
          priority: 'medium',
          dueDate: '2026-10-30',
          status: 'in-progress',
        },
      ],
    },
    {
      ...BOARD_COLUMNS[2],
      tasks: [
        {
          id: 'task-audit',
          title: 'Audit button contrast',
          description: 'Verify primary and secondary button states.',
          priority: 'low',
          dueDate: '2026-10-20',
          status: 'done',
        },
      ],
    },
  ];
}

/**
 * @param {unknown} error
 * @returns {string}
 */
function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} selected
 * @returns {string}
 */
function renderPriorityOptions(selected) {
  return PRIORITIES.map(
    (priority) =>
      `<option value="${priority}" ${priority === selected ? 'selected' : ''}>${priority.charAt(0).toUpperCase() + priority.slice(1)}</option>`
  ).join('');
}

/**
 * Validates the input for creating or updating a task and returns an error object if invalid, otherwise null.
 * @param {{ title: string, description: string, priority: string, dueDate: string }} input
 * @returns {{ field: string, message: string } | null}
 */
function validateTaskInput({ title, description, priority, dueDate }) {
  if (!title) {
    return { field: 'title', message: 'Enter a task name.' };
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return {
      field: 'title',
      message: `Task names must be ${TITLE_MAX_LENGTH} characters or fewer.`,
    };
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return {
      field: 'description',
      message: `Notes must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    };
  }
  if (!isValidPriority(priority)) {
    return { field: 'priority', message: 'Choose a valid task priority.' };
  }
  if (dueDate && !isValidDate(dueDate)) {
    return { field: 'dueDate', message: 'Enter a valid due date.' };
  }
  return null;
}

/**
 * @param {string} value
 * @returns {string}
 */
function formatDueDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Checks if the given value is a valid task object.
 * @param {unknown} task
 * @returns {boolean}
 */
function isValidTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    task.id.length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    task.title.length <= TITLE_MAX_LENGTH &&
    typeof task.description === 'string' &&
    task.description.length <= DESCRIPTION_MAX_LENGTH &&
    isValidPriority(task.priority) &&
    typeof task.dueDate === 'string' &&
    (task.dueDate === '' || isValidDate(task.dueDate))
  );
}

/**
 * @param {unknown} priority
 * @returns {boolean}
 */
function isValidPriority(priority) {
  return typeof priority === 'string' && PRIORITIES.includes(priority);
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isValidDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export { renderKanbanBoard };
