import styles from './Button.module.css';

export default function Button({
  children, variant = 'primary', size = 'md', fullWidth = false,
  loading = false, icon = false, className = '', ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    size !== 'md' && styles[size],
    fullWidth && styles.fullWidth,
    icon && styles.icon,
    loading && styles.loading,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
}
