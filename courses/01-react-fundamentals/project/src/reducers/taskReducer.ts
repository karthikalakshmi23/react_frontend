import type { Task } from '../components/TaskList';
// Used with useReducer in App.tsx

export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';
export const SET_TASKS = 'SET_TASKS';

type AddTaskAction = { type: typeof ADD_TASK; payload: Task };
type UpdateTaskAction = { type: typeof UPDATE_TASK; payload: Partial<Task> & { id: string | number } };
type DeleteTaskAction = { type: typeof DELETE_TASK; payload: string | number };
type ToggleTaskAction = { type: typeof TOGGLE_TASK; payload: string | number };
type SetTasksAction = { type: typeof SET_TASKS; payload: Task[] };

export type TaskAction =
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | ToggleTaskAction
  | SetTasksAction;

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload];
    case UPDATE_TASK:
      return state.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t));
    case DELETE_TASK:
      return state.filter((t) => t.id !== action.payload);
    case TOGGLE_TASK:
      return state.map((t) => (t.id === action.payload ? { ...t, completed: !t.completed } : t));
    case SET_TASKS:
      return action.payload;
    default:
      return state;
  }
}
