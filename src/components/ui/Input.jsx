import styles from './Input.module.css';

export default function Input({
  label, error, hint, leftIcon, rightIcon,
  as: Tag = 'input', className = '', ...props
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <Tag
          className={[
            styles.input,
            error && styles.hasError,
            leftIcon && styles.hasLeft,
            rightIcon && styles.hasRight,
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
