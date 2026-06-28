import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, X, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import Avatar from '../ui/Avatar';
import styles from './Topbar.module.css';

export default function Topbar({ onMobileMenuToggle, mobileMenuOpen, onAddTask }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const searchRef = useRef(null);

  const overdueTasks = tasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()
  );

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    const q = search.toLowerCase();
    const results = tasks.filter(t =>
      t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    ).slice(0, 6);
    setSearchResults(results);
  }, [search, tasks]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (taskId) => {
    setSearch(''); setShowSearch(false);
    navigate('/board');
  };

  return (
    <header className={styles.topbar}>
      {/* Mobile menu toggle */}
      <button className={styles.menuBtn} onClick={onMobileMenuToggle} aria-label="Toggle menu">
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search */}
      <div className={styles.searchWrap} ref={searchRef}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className={styles.searchInput}
            aria-label="Search tasks"
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => { setSearch(''); setSearchResults([]); }}>
              <X size={14} />
            </button>
          )}
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className={styles.searchDropdown}>
            {searchResults.map(t => (
              <button key={t.id} className={styles.searchResult} onClick={() => handleResultClick(t.id)}>
                <span className={styles.resultTitle}>{t.title}</span>
                <span className={`${styles.resultStatus} ${styles[t.status]}`}>
                  {t.status === 'todo' ? 'To Do' : t.status === 'in-progress' ? 'In Progress' : 'Done'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {/* Add Task */}
        <button className={styles.addBtn} onClick={onAddTask} aria-label="Add new task">
          <Plus size={16} />
          <span>New Task</span>
        </button>

        {/* Theme toggle */}
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme" title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className={styles.notifWrap}>
          <button className={styles.iconBtn} onClick={() => setShowNotifs(v => !v)} aria-label="Notifications">
            <Bell size={18} />
            {overdueTasks.length > 0 && (
              <span className={styles.notifDot}>{overdueTasks.length}</span>
            )}
          </button>
          {showNotifs && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span>Notifications</span>
                <span className={styles.notifCount}>{overdueTasks.length} overdue</span>
              </div>
              {overdueTasks.length === 0 ? (
                <p className={styles.notifEmpty}>All caught up! 🎉</p>
              ) : (
                overdueTasks.slice(0, 5).map(t => (
                  <div key={t.id} className={styles.notifItem}>
                    <span className={styles.notifIcon}>⚠️</span>
                    <div>
                      <p className={styles.notifTitle}>{t.title}</p>
                      <p className={styles.notifSub}>Overdue — was due {new Date(t.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          className={styles.avatarBtn}
          onClick={() => navigate('/profile')}
          aria-label="Go to profile"
        >
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
        </button>
      </div>
    </header>
  );
}
