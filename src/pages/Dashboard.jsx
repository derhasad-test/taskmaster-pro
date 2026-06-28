import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, CheckCircle2, Clock, AlertTriangle, ArrowRight, Calendar, Flame } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { getTaskStats, formatDate, isOverdue, sortTasks } from '../utils/taskUtils';
import { PriorityBadge, StatusBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import TaskForm from '../components/tasks/TaskForm';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, RadialBarChart, RadialBar, Legend
} from 'recharts';
import styles from './Dashboard.module.css';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <div className={styles.statBody}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
        {sub && <span className={styles.statSub}>{sub}</span>}
      </div>
    </div>
  );
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Dashboard() {
  const { tasks, categories } = useTasks();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const stats = getTaskStats(tasks);
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed');
  const recentTasks  = sortTasks(tasks, 'createdAt', 'desc').slice(0, 5);
  const upcomingTasks = sortTasks(
    tasks.filter(t => t.status !== 'completed' && t.dueDate),
    'dueDate', 'asc'
  ).slice(0, 5);

  // Chart: tasks by status
  const donutData = [
    { name: 'Completed', value: stats.completed, fill: 'var(--color-success)' },
    { name: 'In Progress', value: stats.inProgress, fill: 'var(--color-warning)' },
    { name: 'To Do', value: stats.todo, fill: 'var(--color-info)' },
  ];

  // Chart: weekly area (synthetic)
  const now = new Date();
  const weeklyData = DAYS.map((d, i) => {
    const base = 2 + Math.round(Math.random() * 4);
    return { day: d, completed: i < 5 ? base : 0, created: base + Math.round(Math.random() * 2) };
  });

  // Category breakdown
  const catData = categories.map(c => ({
    name: c.name,
    color: c.color,
    count: tasks.filter(t => t.categoryId === c.id).length,
  })).filter(c => c.count > 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className={styles.greetingSub}>Here's what's happening with your tasks today.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div className={styles.overdueAlert}>
          <AlertTriangle size={16} />
          <span>You have <strong>{overdueTasks.length}</strong> overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}.</span>
          <Link to="/board" className={styles.overdueLink}>View all <ArrowRight size={14} /></Link>
        </div>
      )}

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        <StatCard icon={<TrendingUp size={22} />} label="Total Tasks" value={stats.total} color="#6C63FF" />
        <StatCard icon={<CheckCircle2 size={22} />} label="Completed" value={stats.completed} color="#10B981" sub={`${stats.completionRate}% done`} />
        <StatCard icon={<Clock size={22} />} label="In Progress" value={stats.inProgress} color="#F59E0B" />
        <StatCard icon={<AlertTriangle size={22} />} label="Overdue" value={stats.overdue} color="#EF4444" />
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        {/* Area chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="created" stroke="#6C63FF" strokeWidth={2} fill="url(#grad1)" name="Created" />
              <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fill="url(#grad2)" name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Task Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart
              cx="50%" cy="50%" innerRadius="40%" outerRadius="90%"
              data={donutData} startAngle={90} endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={8} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>By Category</h3>
          <div className={styles.catList}>
            {catData.length === 0 && <p className={styles.empty}>No categories yet</p>}
            {catData.map(c => (
              <div key={c.name} className={styles.catItem}>
                <div className={styles.catDot} style={{ background: c.color }} />
                <span className={styles.catName}>{c.name}</span>
                <div className={styles.catBar}>
                  <div
                    className={styles.catBarFill}
                    style={{ width: `${(c.count / stats.total) * 100}%`, background: c.color }}
                  />
                </div>
                <span className={styles.catCount}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomRow}>
        {/* Recent tasks */}
        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <h3 className={styles.cardTitle}>Recent Tasks</h3>
            <Link to="/board" className={styles.viewAll}>View all <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.taskList}>
            {recentTasks.length === 0 && <p className={styles.empty}>No tasks yet</p>}
            {recentTasks.map(t => (
              <div key={t.id} className={styles.taskRow}>
                <div className={styles.taskRowLeft}>
                  <span className={styles.taskRowDot} style={{
                    background: t.status === 'completed' ? 'var(--color-success)' :
                      t.status === 'in-progress' ? 'var(--color-warning)' : 'var(--color-info)'
                  }} />
                  <span className={styles.taskRowTitle}>{t.title}</span>
                </div>
                <div className={styles.taskRowRight}>
                  <PriorityBadge priority={t.priority} />
                  {t.dueDate && <span className={styles.taskRowDate}>{formatDate(t.dueDate)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className={styles.listCard}>
          <div className={styles.listHeader}>
            <h3 className={styles.cardTitle}><Calendar size={16} /> Upcoming</h3>
            <Link to="/calendar" className={styles.viewAll}>Calendar <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.taskList}>
            {upcomingTasks.length === 0 && <p className={styles.empty}>No upcoming deadlines</p>}
            {upcomingTasks.map(t => (
              <div key={t.id} className={styles.taskRow}>
                <div className={styles.taskRowLeft}>
                  <Flame size={14} style={{ color: isOverdue(t.dueDate) ? 'var(--color-danger)' : 'var(--color-warning)', flexShrink: 0 }} />
                  <span className={styles.taskRowTitle}>{t.title}</span>
                </div>
                <span className={`${styles.taskRowDate} ${isOverdue(t.dueDate) ? styles.overdueDate : ''}`}>
                  {formatDate(t.dueDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <TaskForm isOpen={showAdd} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
