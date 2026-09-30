export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const TODOS_URL = `${API_BASE_URL}/todos`;
export const TODO_LIST_URL = `${API_BASE_URL}/todo-list`;