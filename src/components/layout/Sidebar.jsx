import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, KanbanSquare, Calendar, BarChart3,
  User, Settings, LogOut, ChevronLeft, ChevronRight,
  CheckSquare, Bell, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import Avatar from '../ui/Avatar';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/board',     icon: KanbanSquare,   label: 'Task Board' },
  { to: '/calendar',  icon: Calendar,        label: 'Calendar' },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
];
const BOTTOM_ITEMS = [
  { to: '/profile',  icon: User,     label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const overdueCount = tasks.filter(t =>
    t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Sparkles size={20} />
        </div>
        {!collapsed && <span className={styles.logoText}>TaskFlow</span>}
      </div>

      {/* Toggle Button */}
      <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle sidebar">
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Nav */}
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navSection}>
          {!collapsed && <span className={styles.sectionLabel}>Menu</span>}
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to} title={collapsed ? label : undefined}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}><Icon size={20} /></span>
              {!collapsed && <span className={styles.navLabel}>{label}</span>}
              {label === 'Dashboard' && overdueCount > 0 && !collapsed && (
                <span className={styles.badge}>{overdueCount}</span>
              )}
            </NavLink>
          ))}
        </div>

        <div className={styles.navSection}>
          {!collapsed && <span className={styles.sectionLabel}>Account</span>}
          {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to} title={collapsed ? label : undefined}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}><Icon size={20} /></span>
              {!collapsed && <span className={styles.navLabel}>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User card */}
      <div className={styles.userCard}>
        <Avatar name={user?.name} src={user?.avatar} size="sm" />
        {!collapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout" aria-label="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
