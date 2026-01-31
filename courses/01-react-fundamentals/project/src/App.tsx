import './App.css'
import { useReducer, useEffect, useContext, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChallengeList from './components/ChallengeList'
import TaskList, { type Task } from './components/TaskList'
import TaskApp from './components/TaskApp'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import { taskReducer } from './reducers/taskReducer'

const STORAGE_KEY = 'task-app-tasks'

const INITIAL_TASKS: Task[] = [
  { id: 1, title: 'First Task', description: 'Description one', priority: 'High', completed: false },
  { id: 2, title: 'Second Task', description: 'Description two', priority: 'Medium', completed: false },
  { id: 3, title: 'Third Task', description: 'Description three', priority: 'Low', completed: false },
  { id: 4, title: 'Fourth Task', description: 'Description four', priority: 'Medium', completed: false },
  { id: 5, title: 'Fifth Task', description: 'Description five', priority: 'High', completed: false },
]

function normalizeTask(t: Task): Task {
  return {
    ...t,
    category: t.category ?? 'General',
    tags: Array.isArray(t.tags) ? t.tags : [],
  }
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return INITIAL_TASKS
    const parsed = JSON.parse(stored) as Task[]
    if (!Array.isArray(parsed)) return INITIAL_TASKS
    return parsed.map(normalizeTask)
  } catch {
    return INITIAL_TASKS
  }
}

function AppContent() {
  const [tasks, dispatch] = useReducer(taskReducer, loadTasks())
  const themeContext = useContext(ThemeContext)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // ignore storage errors
    }
  }, [tasks])

  const handleDelete = useCallback((id: string | number) => {
    if (window.confirm('Are you sure?')) {
      dispatch({ type: 'DELETE_TASK', payload: id })
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="App" data-theme={themeContext?.theme ?? 'light'}>
        {themeContext && (
          <button type="button" id="theme-toggle" onClick={() => themeContext.toggleTheme()}>
            Toggle theme
          </button>
        )}
        <main>
          <Routes>
            <Route path="/" element={<ChallengeList />} />
            <Route path="/challenge/01-static-task-display" element={<TaskList />} />
            <Route path="/challenge/02-dynamic-task-rendering" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm={false} countFormat="tasks" />} />
            <Route path="/challenge/03-adding-new-tasks" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/04-task-completion-toggle" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="completed" />} />
            <Route path="/challenge/05-task-deletion" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" onDelete={handleDelete} />} />
            <Route path="/challenge/06-task-filtering" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/07-priority-based-sorting" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/08-task-editing" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/09-search-functionality" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/10-useeffect-local-storage" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/11-useeffect-debounced-search" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/12-categories-and-tags" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/13-due-dates-and-sorting" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showFilterBar />} />
            <Route path="/challenge/14-task-statistics-dashboard" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" showStatsPanel />} />
            <Route path="/challenge/15-component-organization" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/16-context-api-theme" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/17-custom-hook-uselocalstorage" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/18-usereducer-complex-state" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/19-performance-optimization" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
            <Route path="/challenge/20-error-boundaries" element={<TaskApp tasks={tasks} dispatch={dispatch} showForm countFormat="tasks" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
