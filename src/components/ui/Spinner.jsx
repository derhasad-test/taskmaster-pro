import styles from './Spinner.module.css';

export default function Spinner({ size = 'md', color = 'primary' }) {
  const sizeMap = { sm: 16, md: 32, lg: 48 };
  const px = sizeMap[size] || 32;
  return (
    <div className={styles.spinner} style={{ width: px, height: px }}
      role="status" aria-label="Loading">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export function PageSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '300px', width: '100%',
    }}>
      <Spinner size="lg" />
    </div>
  );
}
