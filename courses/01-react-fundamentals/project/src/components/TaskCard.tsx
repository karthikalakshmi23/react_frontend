interface TaskCardProps {
  id: string | number;
  title: string;
  description: string;
  priority?: string;
  completed?: boolean;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
}

export default function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <article
      id="task-card"
      className={completed ? "completed" : ""}
      data-completed={completed}
      style={{
        background: completed ? "#e6ffe6" : undefined,
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          aria-label={`Complete ${title}`}
          checked={completed}
          onChange={() => onToggle(id)}
        />
      )}

      <h2
        style={{
          textDecoration: completed
            ? "line-through"
            : "none",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          textDecoration: completed
            ? "line-through"
            : "none",
        }}
      >
        {description}
      </p>

      <p>Priority: {priority}</p>

      {onDelete && (
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this task?"
              )
            ) {
              onDelete(id);
            }
          }}
        >
          Delete
        </button>
      )}
    </article>
  );
}
