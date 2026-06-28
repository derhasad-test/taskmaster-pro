import { useState } from 'react';
import { Sun, Moon, Bell, Trash2, Download, Plus, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { SEED_CATEGORIES } from '../data/seedData';
import styles from './Settings.module.css';

function ToggleSwitch({ checked, onChange, id }) {
  return (
    <label className={styles.toggle} htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={e => onChange(e.target.checked)} className={styles.toggleInput} />
      <span className={styles.toggleTrack}>
        <span className={styles.toggleThumb} />
      </span>
    </label>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLeft}>
        <span className={styles.rowLabel}>{label}</span>
        {sub && <span className={styles.rowSub}>{sub}</span>}
      </div>
      <div className={styles.rowRight}>{children}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const { tasks, categories, addCategory, deleteCategory, clearAllTasks } = useTasks();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(user?.notifications || { email: true, browser: true, taskReminders: true });
  const [newCat, setNewCat] = useState({ name: '', color: '#6C63FF', icon: '📁' });
  const [showCatForm, setShowCatForm] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const setNotif = (key) => (val) => {
    const updated = { ...notifs, [key]: val };
    setNotifs(updated);
    updateProfile({ notifications: updated });
    addToast('Notification preference saved', 'success');
  };

  const handleAddCategory = () => {
    if (!newCat.name.trim()) return;
    addCategory(newCat);
    setNewCat({ name: '', color: '#6C63FF', icon: '📁' });
    setShowCatForm(false);
    addToast(`Category "${newCat.name}" added!`, 'success');
  };

  const handleDeleteCategory = (id, name) => {
    deleteCategory(id);
    addToast(`Category "${name}" deleted`, 'info');
  };

  const handleClearData = () => {
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 4000); return; }
    // Clear task data using Context
    clearAllTasks();
    addToast('All task data cleared', 'warning');
    setConfirmClear(false);
    navigate('/dashboard');
  };

  const handleExport = () => {
    const data = { tasks, categories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'taskflow-export.json'; a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported!', 'success');
  };

  const ICONS = ['📁','💼','🎯','🔬','📣','💡','🛠','🎨','📚','⚡','🌟','🔥'];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      {/* Appearance */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Appearance</h2>
        <div className={styles.card}>
          <SettingRow label="Dark Mode" sub="Switch between dark and light theme">
            <div className={styles.themeToggle}>
              <Sun size={16} style={{ color: theme === 'light' ? 'var(--color-warning)' : 'var(--text-tertiary)' }} />
              <ToggleSwitch id="theme" checked={theme === 'dark'} onChange={toggleTheme} />
              <Moon size={16} style={{ color: theme === 'dark' ? 'var(--color-primary)' : 'var(--text-tertiary)' }} />
            </div>
          </SettingRow>
        </div>
      </section>

      {/* Notifications */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <div className={styles.card}>
          <SettingRow label="Email Notifications" sub="Receive task updates via email">
            <ToggleSwitch id="notif-email" checked={notifs.email} onChange={setNotif('email')} />
          </SettingRow>
          <div className={styles.divider} />
          <SettingRow label="Browser Notifications" sub="Push notifications in your browser">
            <ToggleSwitch id="notif-browser" checked={notifs.browser} onChange={setNotif('browser')} />
          </SettingRow>
          <div className={styles.divider} />
          <SettingRow label="Task Reminders" sub="Get reminded about upcoming deadlines">
            <ToggleSwitch id="notif-reminders" checked={notifs.taskReminders} onChange={setNotif('taskReminders')} />
          </SettingRow>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowCatForm(v => !v)}>
            <Plus size={14} /> Add Category
          </Button>
        </div>
        <div className={styles.card}>
          {showCatForm && (
            <div className={styles.catForm}>
              <input
                className={styles.catInput}
                placeholder="Category name"
                value={newCat.name}
                onChange={e => setNewCat(v => ({ ...v, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              />
              <input type="color" className={styles.colorPicker} value={newCat.color}
                onChange={e => setNewCat(v => ({ ...v, color: e.target.value }))} title="Pick color" />
              <div className={styles.iconPicker}>
                {ICONS.map(ic => (
                  <button key={ic} className={`${styles.iconOption} ${newCat.icon === ic ? styles.iconSelected : ''}`}
                    onClick={() => setNewCat(v => ({ ...v, icon: ic }))}>
                    {ic}
                  </button>
                ))}
              </div>
              <div className={styles.catFormActions}>
                <Button size="sm" variant="primary" onClick={handleAddCategory}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowCatForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
          {categories.map(c => (
            <div key={c.id} className={styles.catRow}>
              <div className={styles.catDot} style={{ background: c.color }} />
              <span className={styles.catIcon}>{c.icon}</span>
              <span className={styles.catName}>{c.name}</span>
              <span className={styles.catCount}>{tasks.filter(t => t.categoryId === c.id).length} tasks</span>
              <button className={styles.catDelete} onClick={() => handleDeleteCategory(c.id, c.name)} title="Delete category">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data</h2>
        <div className={styles.card}>
          <SettingRow label="Export Data" sub="Download all your tasks as JSON">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download size={14} /> Export
            </Button>
          </SettingRow>
          <div className={styles.divider} />
          <SettingRow label="Clear All Tasks" sub="Permanently delete all task data. Cannot be undone.">
            <Button
              variant={confirmClear ? 'danger' : 'secondary'} size="sm"
              onClick={handleClearData}
            >
              <Trash2 size={14} />
              {confirmClear ? 'Click again to confirm' : 'Clear Data'}
            </Button>
          </SettingRow>
        </div>
      </section>
    </div>
  );
}
