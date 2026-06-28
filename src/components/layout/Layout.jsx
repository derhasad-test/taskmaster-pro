import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TaskForm from '../tasks/TaskForm';
import styles from './Layout.module.css';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <div className={`${styles.layout} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
      )}

      <div className={styles.main}>
        <Topbar
          onMobileMenuToggle={() => setMobileOpen(v => !v)}
          mobileMenuOpen={mobileOpen}
          onAddTask={() => setShowAddTask(true)}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      {showAddTask && (
        <TaskForm
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
}
