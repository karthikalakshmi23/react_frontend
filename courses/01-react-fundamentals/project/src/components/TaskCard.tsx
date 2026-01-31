import React from 'react';

export interface TaskCardProps {
  id?: string | number;
  title: string;
  description: string;
  priority: string;
  completed?: boolean;
  category?: string;
  tags?: string[];
  dueDate?: string | number;
  onToggle?: () => void;
  onDelete?: (id: string | number) => void;
}

function getDueDateLabel(dueDate: string | number | undefined, completed: boolean | undefined): string | null {
  if (dueDate == null || completed) return null;
  const d = typeof dueDate === 'number' ? new Date(dueDate) : new Date(dueDate);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endToday = new Date(today);
  endToday.setDate(endToday.getDate() + 1);
  const in3 = new Date(today);
  in3.setDate(in3.getDate() + 3);
  d.setHours(0, 0, 0, 0);
  if (d < today) return 'Overdue';
  if (d >= today && d < endToday) return 'Due Today';
  if (d >= today && d <= in3) return 'Due Soon';
  return null;
}

function TaskCard({ id, title, description, priority, completed, category, tags, dueDate, onToggle, onDelete }: TaskCardProps) {
  const cat = category ?? 'General';
  const tagList = tags ?? [];
  const dueLabel = getDueDateLabel(dueDate, completed);
  const isOverdue = dueLabel === 'Overdue';
  const dueDisplay = dueDate != null ? (typeof dueDate === 'number' ? new Date(dueDate) : new Date(dueDate)).toLocaleDateString() : null;
  return (
    <article
      id="task-card"
      data-completed={completed ? 'true' : undefined}
      data-overdue={isOverdue ? 'true' : undefined}
      style={{
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: completed ? '#f0f0f0' : undefined,
      }}
    >
      {onToggle != null && (
        <input
          type="checkbox"
          checked={completed ?? false}
          onChange={onToggle}
          aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
        />
      )}
      <h2 style={{ textDecoration: completed ? 'line-through' : undefined }}>{title}</h2>
      <p style={{ textDecoration: completed ? 'line-through' : undefined }}>{description}</p>
      <p>Priority: {priority}</p>
      <p id="task-category">{cat}</p>
      {tagList.length > 0 && (
        <div id="task-tags">
          {tagList.map((tag) => (
            <span key={tag} data-tag={tag} style={{ marginRight: '0.25rem', padding: '0.125rem 0.5rem', background: '#e0e0e0', borderRadius: '4px' }}>
              {tag}
            </span>
          ))}
        </div>
      )}
      {dueDisplay != null && (
        <p id="task-due-date" style={isOverdue ? { color: 'red', fontWeight: 'bold' } : undefined}>
          Due: {dueDisplay}
          {dueLabel && ` (${dueLabel})`}
        </p>
      )}
      {onDelete != null && id != null && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure?')) {
              onDelete(id);
            }
          }}
          data-testid="delete-task"
        >
          Delete
        </button>
      )}
    </article>
  );
}

export default React.memo(TaskCard);
