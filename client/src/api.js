import { TODOS_URL, TODO_LIST_URL } from './constants'

async function handle(res) {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  // 204 No Content (e.g. DELETE) has no body to parse.
  return res.status === 204 ? null : res.json();
}

export function getTodos(todoListId) {
  return fetch(`${TODOS_URL}?todoListId=${todoListId}`).then(handle);
}

export function createTodo({ title, isComplete = false, todoListId }) {
  return fetch(TODOS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete, todoListId }),
  }).then(handle);
}

export function updateTodo(id, { title, isComplete }) {
  return fetch(`${TODOS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isComplete }),
  }).then(handle);
}

export function deleteTodo(id) {
  return fetch(`${TODOS_URL}/${id}`, { method: 'DELETE' }).then(handle);
}

export function getTodoList() {
  return fetch(TODO_LIST_URL).then(handle);
}

export function createTodoList({ title }) {
  return fetch(TODO_LIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then(handle);
}

export function updateTodoList(id, { title }) {
  return fetch(`${TODO_LIST_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then(handle);
}

export function deleteTodoList(id) {
  return fetch(`${TODO_LIST_URL}/${id}`, {
    method: 'DELETE',
  }).then(handle);
}
