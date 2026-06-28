import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Auth.module.css';

export default function Login() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault(); clearError();
    const e = validate();
    if (Object.keys(e).length) { setFormError(e); return; }
    setFormError({});
    const ok = await login(email, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}><Sparkles size={22} /></div>
            <span className={styles.logoText}>TaskFlow</span>
          </div>
          <h1 className={styles.panelTitle}>Get more done, every day</h1>
          <p className={styles.panelSub}>
            Your tasks, your projects, your goals — beautifully organized in one place.
          </p>
          <div className={styles.panelFeatures}>
            {['Drag & Drop Kanban Board', 'Calendar View', 'Analytics Dashboard', 'Dark Mode'].map(f => (
              <div key={f} className={styles.panelFeature}>
                <span className={styles.featureCheck}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className={styles.form}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to your TaskFlow account</p>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate className={styles.fields}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={formError.email}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={formError.password}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <div className={styles.divider}><span>or try demo</span></div>
          <Button
            variant="secondary" fullWidth
            onClick={async () => {
              // Pre-fill demo credentials
              const ok = await login('demo@taskflow.app', 'demo1234');
              if (!ok) {
                // Register demo user first
                const { signup } = useAuth;
              }
              navigate('/dashboard');
            }}
          >
            Continue as Demo User
          </Button>

          <p className={styles.switchLink}>
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
