import {
    createTodoList,
    updateTodoList,
    deleteTodoList,
} from '../api';

export function useTodoList({
    todoList,
    setTodoList,
    selectedTodoListId,
    setSelectedTodoListId,
    setTodos,
    setError,
}) {
    async function handleAddTodoList(title) {
        try {
            const created = await createTodoList({ title });

            setTodoList((prev) => [...prev, created]);
            setSelectedTodoListId(created.id);
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleRenameTodoList(list, title) {
        try {
            const updated = await updateTodoList(list.id, { title });

            setTodoList((prev) =>
                prev.map((item) =>
                    item.id === updated.id ? updated : item
                )
            );
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDeleteTodoList(list) {
        try {
            await deleteTodoList(list.id);

            const remainingLists = todoList.filter(
                (item) => item.id !== list.id
            );

            setTodoList(remainingLists);

            if (list.id === selectedTodoListId) {
                if (remainingLists.length > 0) {
                    setSelectedTodoListId(remainingLists[0].id);
                } else {
                    setSelectedTodoListId(null);
                    setTodos([]);
                }
            }
        } catch (e) {
            setError(e.message);
        }
    }

    return {
        handleAddTodoList,
        handleRenameTodoList,
        handleDeleteTodoList,
    };
}