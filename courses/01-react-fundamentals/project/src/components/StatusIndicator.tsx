interface StatusIndicatorProps {
  status: 'overdue' | 'due-today' | 'due-soon' | 'completed';
}

const LABELS: Record<string, string> = {
  overdue: 'Overdue',
  'due-today': 'Due Today',
  'due-soon': 'Due Soon',
  completed: 'Completed',
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  return <span data-status={status}>{LABELS[status] ?? status}</span>;
}
