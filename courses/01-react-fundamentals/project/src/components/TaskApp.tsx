import TaskList, { Task } from "./TaskList";
import TaskForm from "./TaskForm";

interface TaskAppProps {
  tasks: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  showForm?: boolean;
  countFormat?: string;
}

function TaskApp({
  tasks,
  setTasks,
  showForm,
}: TaskAppProps) {
  const countText = `${tasks.length} Tasks`;

  const handleAddTask = (task: Task) => {
    if (setTasks) {
      setTasks((prev) => [...prev, task]);
    }
  };

  return (
    <>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <TaskList
        tasks={tasks}
        countText={countText}
      />
    </>
  );
}

export default TaskApp;
