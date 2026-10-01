import { useState } from 'react';

export default function AddTodoListForm({ onAdd }) {
    const [title, setTitle] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        const trimmed = title.trim();

        if (!trimmed) {
            return;
        }

        onAdd(trimmed);
        setTitle('');
    }

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="New list title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button type="submit" className="primary">
                Add List
            </button>
        </form>
    );
}