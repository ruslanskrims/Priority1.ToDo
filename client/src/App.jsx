import { useEffect, useState } from 'react';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoList,
  createTodoList,
  updateTodoList,
  deleteTodoList,
} from './api';
import AddTodoForm from './components/AddTodoForm';
import MultipleTodoList from './components/MultipleTodoList';
import AddTodoListForm from './components/AddTodoListForm';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [selectedTodoListId, setSelectedTodoListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTodoList()
      .then((lists) => {
        setTodoList(lists);

        if (lists.length > 0) {
          setSelectedTodoListId(lists[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedTodoListId === null) {
      setTodos([]);
      return;
    }

    setLoading(true);
    getTodos(selectedTodoListId)
      .then((items) => {
        setTodos(items);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedTodoListId]);

  async function handleAdd(title) {
    if (selectedTodoListId === null) {
      return;
    }

    try {
      const created = await createTodo({
        title,
        todoListId: selectedTodoListId,
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

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>
      {error && <div className="error">{error}</div>}
      <AddTodoListForm onAdd={handleAddTodoList} />
      {selectedTodoListId && (
        <span>You have selected todo list: {todoList.find((item) => item.id === selectedTodoListId).title}</span>
      )}
      <MultipleTodoList
        todoList={todoList}
        selectedTodoListId={selectedTodoListId}
        onSelect={setSelectedTodoListId}
        onRename={handleRenameTodoList}
        onDelete={handleDeleteTodoList}
      />
      {selectedTodoListId !== null && (
        <>
          <AddTodoForm onAdd={handleAdd} />
          {loading ? (
            <p className="muted">Loading...</p>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}