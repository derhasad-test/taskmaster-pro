import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 'var(--z-toast)', width: '340px',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--bg-elevated)',
          border: `1px solid ${t.type === 'success' ? 'var(--color-success)' : t.type === 'error' ? 'var(--color-danger)' : t.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '12px',
          animation: 'slideInRight 0.3s ease',
          cursor: 'pointer',
        }} onClick={() => onRemove(t.id)}>
          <span style={{ fontSize: '18px' }}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-primary)', flex: 1 }}>{t.message}</span>
          <span style={{ fontSize: '18px', color: 'var(--text-tertiary)', lineHeight: 1 }}>×</span>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
