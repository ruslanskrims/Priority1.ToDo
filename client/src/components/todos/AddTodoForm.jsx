import { useState } from 'react';

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed, dueDate);
    setTitle('');
    setDueDate('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Todo title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit" className="primary">
        Add
      </button>
    </form>
  );
}
