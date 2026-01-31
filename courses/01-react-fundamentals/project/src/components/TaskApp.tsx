import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Dispatch } from 'react';
import TaskList, { Task } from './TaskList';
import TaskForm from './TaskForm';
import FilterBar, { type SortOrder } from './FilterBar';
import StatsPanel from './StatsPanel';
import type { TaskAction } from '../reducers/taskReducer';
// dispatch from parent App's useReducer(taskReducer, ...)

type FilterType = 'all' | 'active' | 'completed';

const PRIORITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

function toTime(d: string | number | undefined): number {
  if (d == null) return Infinity;
  const t = typeof d === 'number' ? d : new Date(d).getTime();
  return isNaN(t) ? Infinity : t;
}

function sortTasks(tasks: Task[], sortOrder: SortOrder): Task[] {
  const copy = [...tasks];
  if (sortOrder === 'recent') return copy;
  if (sortOrder === 'priority-high-low') {
    return copy.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2));
  }
  if (sortOrder === 'priority-low-high') {
    return copy.sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 2) - (PRIORITY_ORDER[a.priority] ?? 2));
  }
  if (sortOrder === 'alphabetical') {
    return copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }
  if (sortOrder === 'due-date-soonest') {
    return copy.sort((a, b) => toTime(a.dueDate) - toTime(b.dueDate));
  }
  return copy;
}

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  dispatch?: Dispatch<TaskAction>;
  showForm?: boolean;
  countFormat?: 'tasks' | 'completed';
  onDelete?: (id: string | number) => void;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
}

function isOverdue(t: Task): boolean {
  if (t.completed || t.dueDate == null) return false;
  const ts = typeof t.dueDate === 'number' ? t.dueDate : new Date(t.dueDate).getTime();
  return !isNaN(ts) && ts < Date.now();
}

export default function TaskApp({ tasks, setTasks, dispatch, showForm = false, countFormat = 'tasks', onDelete, showFilterBar = false, showStatsPanel = false }: TaskAppProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const categories = [...new Set(tasks.map((t) => t.category ?? 'General').filter(Boolean))].sort();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    return { total, completed, active, overdue };
  }, [tasks]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleAddTask = useCallback(
    (task: Task) => {
      if (dispatch) {
        dispatch({ type: 'ADD_TASK', payload: task });
      } else if (setTasks) {
        setTasks((prev) => [...prev, task]);
      }
    },
    [dispatch, setTasks]
  );

  const handleToggle = useCallback(
    (id: string | number) => {
      if (dispatch) {
        dispatch({ type: 'TOGGLE_TASK', payload: id });
      } else if (setTasks) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
      }
    },
    [dispatch, setTasks]
  );

  const statusFiltered =
    !showFilterBar
      ? tasks
      : filter === 'all'
        ? tasks
        : filter === 'active'
          ? tasks.filter((t) => !t.completed)
          : tasks.filter((t) => t.completed);

  const categoryFiltered =
    !showFilterBar || !categoryFilter
      ? statusFiltered
      : statusFiltered.filter((t) => (t.category ?? 'General') === categoryFilter);

  const q = (showFilterBar ? debouncedSearch : '').trim().toLowerCase();
  const filteredTasks =
    !q ? categoryFiltered : categoryFiltered.filter((t) => (t.title + ' ' + (t.description ?? '')).toLowerCase().includes(q));

  const displayedTasks = showFilterBar ? sortTasks(filteredTasks, sortOrder) : filteredTasks;
  const showSearchingIndicator = showFilterBar && searchQuery !== debouncedSearch;

  const completedCount = tasks.filter((t) => t.completed).length;
  const countText =
    countFormat === 'completed'
      ? `${completedCount} of ${tasks.length} completed`
      : showFilterBar
        ? `Showing ${filteredTasks.length} of ${tasks.length} tasks`
        : `${tasks.length} Tasks`;

  return (
    <div>
      {showStatsPanel && (
        <StatsPanel total={stats.total} completed={stats.completed} active={stats.active} overdue={stats.overdue} />
      )}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      {showForm && <TaskForm onAddTask={handleAddTask} existingCategories={['General', 'Work', 'Personal', ...categories]} />}
      {showSearchingIndicator && <p id="searching-indicator">Searching...</p>}
      {showFilterBar && filteredTasks.length === 0 && !showSearchingIndicator && (
        <p id="filter-empty-message">
          {debouncedSearch ? `No tasks found for "${debouncedSearch}"` : 'No tasks match this filter'}
        </p>
      )}
      <TaskList tasks={showFilterBar ? displayedTasks : tasks} onToggle={handleToggle} onDelete={onDelete} countText={countText} />
    </div>
  );
}
