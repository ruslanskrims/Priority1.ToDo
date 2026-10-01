import { useState } from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

export default function TodoList({ todos, onToggle, onUpdate, onDelete }) {
  const [sortBy, setSortBy] = useState('createDate');
  const [editingTodoId, setEditingTodoId] = useState(null);

  if (todos?.length === 0) {
    return <p className="muted">No todos yet. Add one above.</p>;
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) {
        return 0;
      }
      if (!a.dueDate) {
        return 1;
      }
      if (!b.dueDate) {
        return -1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    }
    return new Date(b.createDate) - new Date(a.createDate);
  });

  return (
    <>
      <div className="todo-sort">
        <label htmlFor="sortBy">
          Sort by:
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createDate">
            Create Date
          </option>

          <option value="dueDate">
            Due Date
          </option>
        </select>
      </div>
      {sortedTodos.length === 0 ? (
        <p className="muted">
          No todos yet. Add one above.
        </p>
      ) : (
        <ul className="todo-list">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onDelete={onDelete}
              editing={editingTodoId === todo.id}
              onStartEdit={() => setEditingTodoId(todo.id)}
              onFinishEdit={() => setEditingTodoId(null)}
            />
          ))}
        </ul>
      )}
    </>
  );
}
