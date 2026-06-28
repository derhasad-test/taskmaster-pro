import { getInitials } from '../../utils/taskUtils';
import styles from './Avatar.module.css';

const COLORS = [
  '#6C63FF', '#FF6584', '#10B981', '#F59E0B', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4',
];

function getColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const initials = getInitials(name);
  const bg = getColor(name);
  const sizeMap = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };
  const px = sizeMap[size] || 40;
  const fontSize = px * 0.38;

  if (src) {
    return (
      <img
        src={src} alt={name}
        className={`${styles.avatar} ${className}`}
        style={{ width: px, height: px, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{ width: px, height: px, background: bg, fontSize, flexShrink: 0 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
