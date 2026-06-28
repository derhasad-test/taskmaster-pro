import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS, STATUS_LABELS } from '../../utils/taskUtils';

export function PriorityBadge({ priority }) {
  const color = PRIORITY_COLORS[priority] || 'var(--text-tertiary)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
      textTransform: 'uppercase',
      background: `${color}20`, color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || 'var(--text-tertiary)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 10px', borderRadius: 'var(--radius-full)',
      fontSize: '12px', fontWeight: 600,
      background: `${color}20`, color,
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: '12px', fontWeight: 500,
      background: `${category.color}20`, color: category.color,
    }}>
      {category.icon} {category.name}
    </span>
  );
}

export function TagBadge({ tag }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: '11px', fontWeight: 500,
      background: 'var(--bg-hover)', color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
    }}>
      #{tag}
    </span>
  );
}
