interface StatsPanelProps {
  total?: number;
  completed?: number;
  active?: number;
  overdue?: number;
}

export default function StatsPanel({ total = 0, completed = 0, active = 0, overdue = 0 }: StatsPanelProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div id="stats-panel" data-total={total} data-completed={completed} data-active={active} data-overdue={overdue}>
      <span>Total: {total}</span>
      <span>Completed: {completed} ({pct}%)</span>
      <span>Active: {active}</span>
      <span>Overdue: {overdue}</span>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#4caf50' }} />
      </div>
    </div>
  );
}
