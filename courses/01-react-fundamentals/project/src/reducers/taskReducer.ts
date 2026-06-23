import type { Task } from "../components/TaskList";

// Action type constants
export const ADD_TASK = "ADD_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const TOGGLE_TASK = "TOGGLE_TASK";
export const SET_TASKS = "SET_TASKS";

// Action types
type AddTaskAction = { type: typeof ADD_TASK; payload: Task };
type UpdateTaskAction = { type: typeof UPDATE_TASK; payload: Task };
type DeleteTaskAction = { type: typeof DELETE_TASK; payload: string | number };
type ToggleTaskAction = { type: typeof TOGGLE_TASK; payload: string | number };
type SetTasksAction = { type: typeof SET_TASKS; payload: Task[] };

export type TaskAction =
  | AddTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | ToggleTaskAction
  | SetTasksAction;

// Reducer
export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload];
    case UPDATE_TASK:
      return state.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
    case DELETE_TASK:
      return state.filter((t) => t.id !== action.payload);
    case TOGGLE_TASK:
      return state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
    case SET_TASKS:
      return action.payload;
    default:
      return state;
  }
}

// Action creators
export const addTask = (task: Task): AddTaskAction => ({
  type: ADD_TASK,
  payload: task,
});
export const updateTask = (task: Task): UpdateTaskAction => ({
  type: UPDATE_TASK,
  payload: task,
});
export const deleteTask = (id: string | number): DeleteTaskAction => ({
  type: DELETE_TASK,
  payload: id,
});
export const toggleTask = (id: string | number): ToggleTaskAction => ({
  type: TOGGLE_TASK,
  payload: id,
});
export const setTasks = (tasks: Task[]): SetTasksAction => ({
  type: SET_TASKS,
  payload: tasks,
});
