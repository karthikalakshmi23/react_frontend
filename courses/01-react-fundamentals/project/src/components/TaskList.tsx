import TaskCard from './TaskCard';

export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  category?: string;
  tags?: string[];
  dueDate?: string | number;
}

const HARDCODED_TASKS: Task[] = [
  { id: 1, title: 'Task One', description: 'First hardcoded task', priority: 'High', completed: false },
  { id: 2, title: 'Task Two', description: 'Second hardcoded task', priority: 'Medium', completed: false },
  { id: 3, title: 'Task Three', description: 'Third hardcoded task', priority: 'Low', completed: false },
];

interface TaskListProps {
  tasks?: Task[];
  countText?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

export default function TaskList({ tasks, countText, onToggle, onDelete }: TaskListProps) {
  const list = tasks ?? HARDCODED_TASKS;
  if (list.length === 0) {
    return <section id="task-list" />;
  }
  return (
    <section id="task-list">
      {countText != null && <p id="task-count">{countText}</p>}
      {list.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          category={task.category}
          tags={task.tags}
          dueDate={task.dueDate}
          onToggle={onToggle != null ? () => onToggle(task.id) : undefined}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
