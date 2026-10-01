import { useState } from "react";

export function MultipleTodoListItem({
    list,
    selected,
    onSelect,
    onRename,
    onDelete,
}) {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(list.title);

    function saveEdit() {
        const trimmed = inputValue.trim();

        if (trimmed && trimmed !== list.title) {
            onRename(list, trimmed);
        } else {
            setInputValue(list.title);
        }

        setEditing(false);
    }

    return (
        <div className={`multiple-todo-list-item ${selected ? 'selected' : ''}`} onClick={() => onSelect(list.id)}>
            {editing ? (
                <input
                    value={inputValue}
                    autoFocus
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={saveEdit}
                />
            ) : (
                <div
                    onClick={() => onSelect(list.id)}
                >
                    {list.title}
                </div>
            )}
            <div className="multiple-todo-list-item__actions">
                {!editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                    >
                        Edit
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onDelete(list)}
                >
                    Delete
                </button>
            </div>

        </div>
    );
}