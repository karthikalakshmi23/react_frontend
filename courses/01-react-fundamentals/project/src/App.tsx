import { useReducer, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChallengeList from "./components/ChallengeList";
import TaskList from "./components/TaskList";
import TaskApp from "./components/TaskApp";
import TaskDetailPage from "./components/TaskDetailPage";
import FetchDemoView from "./components/FetchDemoView";

import { ThemeProvider } from "./contexts/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { taskReducer, setTasks, deleteTask } from "./reducers/taskReducer";
import type { TaskAction } from "./reducers/taskReducer";

import type { Task } from "./components/TaskList";

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "First Task", description: "Description one", priority: "High", completed: false, category: "General", tags: [] },
  { id: 2, title: "Second Task", description: "Description two", priority: "Medium", completed: false, category: "Work", tags: ["office"] },
  { id: 3, title: "Third Task", description: "Description three", priority: "Low", completed: false, category: "Personal", tags: ["important"] },
  { id: 4, title: "Fourth Task", description: "Description four", priority: "Medium", completed: false, category: "General", tags: [] },
  { id: 5, title: "Fifth Task", description: "Description five", priority: "High", completed: false, category: "Work", tags: [] },
];

function AppContent() {
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('task-app-tasks', INITIAL_TASKS);
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks);

  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  useEffect(() => {
    dispatch(setTasks(storedTasks));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id: string | number) => {
    dispatch(deleteTask(id));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<ChallengeList />} />
            <Route path="/challenge/01-static-task-display" element={<TaskList />} />
            <Route path="/challenge/02-dynamic-task-rendering" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm={false} />} />
            <Route path="/challenge/03-adding-new-tasks" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm />} />
            <Route path="/challenge/04-task-completion-toggle" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm />} />
            <Route path="/challenge/05-task-deletion" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} />} />
            <Route path="/challenge/06-task-filtering" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm />} />
            <Route path="/challenge/08-task-editing" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} />} />
            <Route path="/challenge/09-search-functionality" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} />} />
            <Route path="/challenge/10-useeffect-local-storage" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} />} />
            <Route path="/challenge/11-useeffect-debounced-search" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} />} />
            <Route path="/challenge/12-categories-and-tags" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} />} />
            <Route path="/challenge/16-context-api-theme" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} showFilterBar showStatsPanel />} />
            <Route path="/challenge/17-custom-hook-uselocalstorage" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} showFilterBar showStatsPanel />} />
            <Route path="/challenge/18-usereducer-complex-state" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} showFilterBar showStatsPanel />} />
            <Route path="/challenge/19-performance-optimization" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} showFilterBar showStatsPanel />} />
            <Route path="/challenge/20-error-boundaries" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm onDelete={handleDelete} showFilterBar showStatsPanel />} />
            <Route path="/challenge/21-react-router" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm />} />
            <Route path="/challenge/21-react-router/task/:id" element={<TaskDetailPage />} />
            <Route path="/challenge/22-data-fetching" element={<FetchDemoView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
