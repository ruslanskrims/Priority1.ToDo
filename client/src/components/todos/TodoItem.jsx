import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [draftDueDate, setDraftDueDate] = useState(todo.dueDate || '');
  
  function saveEdit() {
    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    onUpdate(
      todo,
      trimmed,
      draftDueDate || null
    );

    setEditing(false);
  }

  function cancelEdit() {
    setDraft(todo.title);
    setDraftDueDate(todo.dueDate || '');
    setEditing(false);
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
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveEdit();
              }
              if (e.key === 'Escape') {
                setDraft(todo.title);
                setEditing(false);
              }
            }}
          />
          <input
              type="date"
              value={draftDueDate}
              onChange={(e) => setDraftDueDate(e.target.value)}
            />
            </>
        ) : (
          <span
            className={`title ${todo.isComplete ? 'complete' : ''}`}
            onDoubleClick={() => setEditing(true)}
            title="Double-click to edit"
          >
            {todo.title}
          </span>
        )}
        {todo.dueDate && (
          <span className='todo-item__due-date'>
            {overdue ? (
              <span className="todo-item__overdue-text">Overdue</span>
            ) : (
              <span className="todo-item__due-text">
                Due: {todo.dueDate}
              </span>
            )}
          </span>
        )}
      </div>
      <div className='todo-item__actions'>
        {!editing && (
          <button onClick={() => setEditing(true)}>
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