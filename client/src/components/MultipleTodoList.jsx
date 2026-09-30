import {MultipleTodoListItem} from './MultipleTodoListItem';
import './MultipleTodoList.css';

export default function MultipleTodoList({
  todoList,
  selectedTodoListId,
  onSelect,
  onRename,
  onDelete,
}) {
  if (!todoList || todoList.length === 0) {
    return <p className="muted">No lists yet.</p>;
  }

  return (
    <div className="multiple-todo-list">
      <h2>Lists</h2>
      {todoList.map((list) => (
        <MultipleTodoListItem
          key={list.id}
          list={list}
          selected={list.id === selectedTodoListId}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}