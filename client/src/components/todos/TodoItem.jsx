import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  function saveEdit() {
    const trimmed = draft.trim();

    if (trimmed && trimmed !== todo.title) {
      onRename(todo, trimmed);
    } else {
      setDraft(todo.title);
    }

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
          <span>
            Due: {todo.dueDate}
            {overdue && 'Overdue'}
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