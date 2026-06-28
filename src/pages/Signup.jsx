import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Auth.module.css';

export default function Signup() {
  const { signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState({});

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault(); clearError();
    const errs = validate();
    if (Object.keys(errs).length) { setFormError(errs); return; }
    setFormError({});
    const ok = await signup(form.name, form.email, form.password);
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
          <h1 className={styles.panelTitle}>Your productivity journey starts here</h1>
          <p className={styles.panelSub}>
            Create your free account and start organizing your work the way you've always wanted.
          </p>
          <div className={styles.panelFeatures}>
            {['Unlimited tasks & projects', 'Kanban + Calendar views', 'Analytics & insights', 'Completely free'].map(f => (
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
          <h2 className={styles.formTitle}>Create your account</h2>
          <p className={styles.formSub}>Free forever. No credit card required.</p>

          {error && <div className={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate className={styles.fields}>
            <Input
              label="Full name"
              type="text"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={set('name')}
              error={formError.name}
              leftIcon={<User size={16} />}
              autoComplete="name"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              error={formError.email}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={set('password')}
              error={formError.password}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              type={showPw ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={set('confirm')}
              error={formError.confirm}
              leftIcon={<Lock size={16} />}
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <p className={styles.switchLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
