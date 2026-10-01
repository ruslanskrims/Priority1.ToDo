import { useEffect, useState } from 'react';
import {
  getTodos,
  getTodoList,
} from './api';
import AddTodoForm from './components/todos/AddTodoForm';
import MultipleTodoList from './components/todoList/MultipleTodoList';
import AddTodoListForm from './components/todoList/AddTodoListForm';
import TodoList from './components/todos/TodoList';
import { useTodoList } from './hooks/useTodoList';
import { useTodos } from './hooks/useTodos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [selectedTodoListId, setSelectedTodoListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleAddTodoList,
    handleRenameTodoList,
    handleDeleteTodoList,
  } = useTodoList({
    todoList,
    setTodoList,
    selectedTodoListId,
    setSelectedTodoListId,
    setTodos,
    setError,
  });

  const {
    handleAdd,
    handleToggle,
    handleUpdate,
    handleDelete,
  } = useTodos({
    selectedTodoListId,
    setTodos,
    setError,
  });

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

  const selectedTodoList = todoList.find((list) => list.id === selectedTodoListId);

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>
      <h2>Create new todo list</h2>
      {error && <div className="error">{error}</div>}
      <AddTodoListForm onAdd={handleAddTodoList} />
      {selectedTodoListId && (
        <h3>You have selected todo list: {selectedTodoList?.title}</h3>
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
          <h2>Create new todo</h2>
          <AddTodoForm onAdd={handleAdd} />
          {loading ? (
            <p className="muted">Loading...</p>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              handleUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}