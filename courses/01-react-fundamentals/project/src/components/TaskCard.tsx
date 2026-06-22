import Badge from './Badge'
import StatusIndicator from './StatusIndicator'
import Button from './Button'

interface TaskCardProps {
  id?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  id,
  title,
  description,
  priority,
  completed = false,
  category = 'General',
  tags = [],
  dueDate,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let isOverdue = false
  let isDueToday = false
  let isDueSoon = false

  if (dueDate) {
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const difference = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    isOverdue = difference < 0 && !completed
    isDueToday = difference === 0
    isDueSoon = difference > 0 && difference <= 3
  }

  return (
    <article
      id="task-card"
      data-completed={completed}
      data-overdue={isOverdue}
      style={{
        backgroundColor: completed ? '#e5ffe5' : 'white',
        border: isOverdue ? '2px solid red' : '1px solid #ccc',
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id!)}
        />
      )}

      <h2>{title}</h2>
      <p>{description}</p>

      <Badge variant="priority">Priority: {priority}</Badge>

      <div id="task-category">
        <Badge variant="category">Category: {category}</Badge>
      </div>

      <div id="task-tags">
        {tags.map((tag) => (
          <Badge key={tag} variant="tag">{tag}</Badge>
        ))}
      </div>

      {dueDate && (
        <p id="task-due-date">
          Due: {new Date(dueDate).toLocaleDateString()}
        </p>
      )}

      {isOverdue && <StatusIndicator status="overdue" />}
      {isDueToday && <StatusIndicator status="due-today" />}
      {isDueSoon && !isDueToday && <StatusIndicator status="due-soon" />}

      {onDelete && (
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              onDelete(id!)
            }
          }}
        >
          Delete
        </Button>
      )}
    </article>
  )
}
