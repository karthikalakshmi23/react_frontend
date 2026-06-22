export interface StatusIndicatorProps {
  status: 'overdue' | 'due-today' | 'due-soon' | 'completed'
}

const STATUS_STYLES: Record<StatusIndicatorProps['status'], { color: string; label: string }> = {
  overdue:    { color: 'red',    label: 'Overdue'   },
  'due-today':{ color: 'orange', label: 'Due Today' },
  'due-soon': { color: 'green',  label: 'Due Soon'  },
  completed:  { color: 'gray',   label: 'Completed' },
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const { color, label } = STATUS_STYLES[status]
  return <p style={{ color }}>{label}</p>
}
