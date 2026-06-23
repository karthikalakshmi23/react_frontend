import { useCallback, useEffect, useMemo, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import { useTheme } from "../contexts/ThemeContext";
import { addTask, updateTask, toggleTask } from "../reducers/taskReducer";
import type { TaskAction } from "../reducers/taskReducer";
import type { Task } from "./TaskList";

interface TaskAppProps {
  tasks: Task[];
  dispatch?: React.Dispatch<TaskAction>;
  showForm?: boolean;
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
}

export default function TaskApp({
  tasks,
  dispatch,
  showForm,
  onDelete,
  showFilterBar,
  showStatsPanel,
}: TaskAppProps) {
  const { theme, toggleTheme } = useTheme();

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const categories = useMemo(
    () => [...new Set(tasks.map((task) => task.category).filter(Boolean))],
    [tasks]
  );

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleAddTask = useCallback(
    (task: Task) => {
      if (dispatch) {
        dispatch(addTask(task));
      }
    },
    [dispatch]
  );

  const handleToggle = useCallback(
    (id: string | number) => {
      if (dispatch) {
        dispatch(toggleTask(id));
      }
    },
    [dispatch]
  );

  const handleUpdateTask = useCallback(
    (
      id: string | number,
      updates: { title: string; description: string; priority: string }
    ) => {
      if (!dispatch) return;
      if (!updates.title.trim()) return;
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;
      dispatch(updateTask({ ...existing, ...updates }));
      setEditingId(null);
    },
    [dispatch, tasks]
  );

  const sortedTasks = useMemo(() => {
    const priorityValue: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

    let filtered =
      filter === "all"
        ? tasks
        : filter === "active"
        ? tasks.filter((task) => !task.completed)
        : tasks.filter((task) => task.completed);

    if (selectedCategory !== "All categories") {
      filtered = filtered.filter((task) => task.category === selectedCategory);
    }

    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
        task.description.toLowerCase().includes(debouncedSearchText.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "high")
        return priorityValue[b.priority] - priorityValue[a.priority];
      if (sortOrder === "low")
        return priorityValue[a.priority] - priorityValue[b.priority];
      if (sortOrder === "alphabetical")
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      if (sortOrder === "due-date") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [tasks, filter, sortOrder, selectedCategory, debouncedSearchText]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;
    const overdue = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate).getTime() < Date.now()
    ).length;
    const completedPercentage =
      total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, overdue, completedPercentage };
  }, [tasks]);

  const handleClearSearch = useCallback(() => {
    setSearchText("");
    setDebouncedSearchText("");
  }, []);

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '1px solid var(--border)',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {showForm && <TaskForm onAddTask={handleAddTask} />}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchText={searchText}
          onSearchChange={setSearchText}
          onClearSearch={handleClearSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {showStatsPanel && (
        <StatsPanel
          total={stats.total}
          completed={stats.completed}
          active={stats.active}
          overdue={stats.overdue}
          completedPercentage={stats.completedPercentage}
        />
      )}

      {isSearching && searchText !== debouncedSearchText && (
        <div id="searching-indicator">Searching...</div>
      )}

      <div id="task-count">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>

      {sortedTasks.length === 0 ? (
        <div id="filter-empty-message">No tasks found</div>
      ) : (
        <TaskList
          tasks={sortedTasks}
          onToggle={handleToggle}
          onDelete={onDelete}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      )}
    </main>
  );
}
