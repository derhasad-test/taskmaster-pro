import { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { getTaskStats, getWeeklyData, PRIORITY_LABELS, PRIORITY_COLORS } from '../utils/taskUtils';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';
import styles from './Analytics.module.css';

const COLORS = ['#6C63FF', '#FF6584', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

function MetricCard({ label, value, sub, color }) {
  return (
    <div className={styles.metric}>
      <span className={styles.metricValue} style={{ color }}>{value}</span>
      <span className={styles.metricLabel}>{label}</span>
      {sub && <span className={styles.metricSub}>{sub}</span>}
    </div>
  );
}

export default function Analytics() {
  const { tasks, categories } = useTasks();
  const stats = getTaskStats(tasks);
  const weeklyData = getWeeklyData(tasks);

  // Priority distribution
  const priorityData = ['urgent','high','medium','low'].map(p => ({
    name: PRIORITY_LABELS[p],
    value: tasks.filter(t => t.priority === p).length,
    fill: PRIORITY_COLORS[p],
  })).filter(d => d.value > 0);

  // Category distribution
  const categoryData = categories.map((c, i) => ({
    name: c.name,
    value: tasks.filter(t => t.categoryId === c.id).length,
    fill: c.color || COLORS[i % COLORS.length],
  })).filter(d => d.value > 0);

  // Status data
  const statusData = [
    { name: 'To Do',       value: stats.todo,       fill: '#3B82F6' },
    { name: 'In Progress', value: stats.inProgress, fill: '#F59E0B' },
    { name: 'Completed',   value: stats.completed,  fill: '#10B981' },
  ];

  // Productivity score
  const productivityScore = Math.min(100, Math.round(
    (stats.completionRate * 0.5) +
    (stats.overdue === 0 ? 30 : Math.max(0, 30 - stats.overdue * 5)) +
    (stats.inProgress > 0 ? 20 : 0)
  ));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
        {label && <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.sub}>Insights into your productivity and task patterns</p>
      </div>

      {/* Top Metrics */}
      <div className={styles.metrics}>
        <MetricCard label="Total Tasks" value={stats.total} color="var(--color-primary)" />
        <MetricCard label="Completion Rate" value={`${stats.completionRate}%`} sub={`${stats.completed} done`} color="var(--color-success)" />
        <MetricCard label="In Progress" value={stats.inProgress} color="var(--color-warning)" />
        <MetricCard label="Overdue" value={stats.overdue} sub={stats.overdue > 0 ? 'Need attention' : 'All on track!'} color={stats.overdue > 0 ? 'var(--color-danger)' : 'var(--color-success)'} />
        <MetricCard label="Productivity Score" value={`${productivityScore}%`} sub={productivityScore >= 70 ? '🔥 On fire!' : productivityScore >= 40 ? '📈 Getting there' : '💪 Keep going'} color="var(--color-primary)" />
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Weekly Area Chart */}
        <div className={`${styles.chartCard} ${styles.wide}`}>
          <h3 className={styles.cardTitle}>Weekly Task Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="aCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="aCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="created" stroke="#6C63FF" strokeWidth={2} fill="url(#aCreated)" name="Created" />
              <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} fill="url(#aCompleted)" name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6,6,0,0]} name="Tasks">
                {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData} cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                dataKey="value" nameKey="name"
                paddingAngle={3}
              >
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className={`${styles.chartCard} ${styles.wide}`}>
          <h3 className={styles.cardTitle}>Tasks by Category</h3>
          {categoryData.length === 0 ? (
            <p className={styles.empty}>No categories found</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0,6,6,0]} name="Tasks">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
