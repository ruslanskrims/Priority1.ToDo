import {
    createTodo,
    updateTodo,
    deleteTodo,
} from '../api';

export function useTodos({
    selectedTodoListId,
    setTodos,
    setError,
}) {
    async function handleAdd(title, dueDate) {
        if (selectedTodoListId === null) {
            return;
        }

        try {
            const created = await createTodo({
                title,
                todoListId: selectedTodoListId,
                dueDate
            });

            setTodos((prev) => [...prev, created]);
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleToggle(todo) {
        try {
            const updated = await updateTodo(todo.id, {
                title: todo.title,
                isComplete: !todo.isComplete,
                dueDate: todo.dueDate
            });

            setTodos((prev) =>
                prev.map((item) =>
                    item.id === updated.id ? updated : item
                )
            );
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleRename(todo, title) {
        try {
            const updated = await updateTodo(todo.id, {
                title,
                isComplete: todo.isComplete,
                dueDate: todo.dueDate
            });

            setTodos((prev) =>
                prev.map((item) =>
                    item.id === updated.id ? updated : item
                )
            );
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(todo) {
        try {
            await deleteTodo(todo.id);

            setTodos((prev) =>
                prev.filter((item) => item.id !== todo.id)
            );
        } catch (e) {
            setError(e.message);
        }
    }

    return {
        handleAdd,
        handleToggle,
        handleRename,
        handleDelete,
    };
}