import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onUpdate, onDelete,
  editing,
  onStartEdit,
  onFinishEdit
}) {
  const [draft, setDraft] = useState(todo.title);
  const [draftDueDate, setDraftDueDate] = useState(todo.dueDate || '');

  function startEdit() {
    setDraft(todo.title);
    setDraftDueDate(todo.dueDate || '');
    onStartEdit();
  }

  function saveEdit() {
    const trimmed = draft.trim();
    const newDueDate = draftDueDate || null;
    const currentDueDate = todo.dueDate || null;

    if (!trimmed) {
      return;
    }

    const titleChanged = trimmed !== todo.title;
    const dueDateChanged = newDueDate !== currentDueDate;

    if (!titleChanged && !dueDateChanged) {
      onFinishEdit();
      return;
    }

    onUpdate(
      todo,
      trimmed,
      newDueDate
    );

    onFinishEdit();
  }

  function cancelEdit() {
    setDraft(todo.title);
    setDraftDueDate(todo.dueDate || '');
    onFinishEdit();
  }

  function isOverdue() {
    if (!todo.dueDate || todo.isComplete) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    return todo.dueDate < today;
  }

  const overdue = isOverdue();

  return (
    <li className={`todo-item ${overdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => onToggle(todo)}
        title="Mark complete / incomplete"
      />
      <div className="todo-content">
        {editing ? (
          <>
            <input
              className="edit-title"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveEdit();
                }

                if (e.key === 'Escape') {
                  cancelEdit();
                }
              }}
            />

            <input
              className="edit-due-date"
              type="date"
              value={draftDueDate}
              onChange={(e) => setDraftDueDate(e.target.value)}
            />
          </>
        ) : (
          <>
            <span
              className={`title ${todo.isComplete ? 'complete' : ''}`}
              onDoubleClick={startEdit}
              title="Double-click to edit"
            >
              {todo.title}
            </span>

            {todo.dueDate && (
              <span className="todo-item__due-date">
                {overdue ? (
                  <span className="todo-item__overdue-text">
                    Overdue
                  </span>
                ) : (
                  <span className="todo-item__due-text">
                    Due: {todo.dueDate}
                  </span>
                )}
              </span>
            )}
          </>
        )}
      </div>
      <div className="todo-item__actions">
        {editing ? (
          <>
            <button onClick={saveEdit} disabled={!draft.trim() || !draftDueDate}>
              Save
            </button>

            <button onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={startEdit}>
            Edit
          </button>
        )}

        <button onClick={() => onDelete(todo)}>
          Delete
        </button>
      </div>
    </li>
  );
}