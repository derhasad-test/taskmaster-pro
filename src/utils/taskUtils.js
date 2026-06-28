import { format, isToday, isTomorrow, isPast, parseISO, differenceInDays } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d, yyyy');
  } catch { return dateStr; }
}

export function formatDateShort(dateStr) {
  if (!dateStr) return null;
  try { return format(parseISO(dateStr), 'MMM d'); }
  catch { return dateStr; }
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  try { return isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr)); }
  catch { return false; }
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  try { return differenceInDays(parseISO(dateStr), new Date()); }
  catch { return null; }
}

export function getDueDateStatus(dateStr) {
  if (!dateStr) return null;
  const days = daysUntil(dateStr);
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 2) return 'soon';
  return 'upcoming';
}

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
export const STATUSES = ['todo', 'in-progress', 'completed'];

export const PRIORITY_LABELS = {
  low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent',
};
export const PRIORITY_COLORS = {
  low:    'var(--color-priority-low)',
  medium: 'var(--color-priority-medium)',
  high:   'var(--color-priority-high)',
  urgent: 'var(--color-priority-urgent)',
};
export const STATUS_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};
export const STATUS_COLORS = {
  'todo': 'var(--color-info)',
  'in-progress': 'var(--color-warning)',
  'completed': 'var(--color-success)',
};

export function filterTasks(tasks, { search, status, priority, categoryId }) {
  return tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (status && t.status !== status) return false;
    if (priority && t.priority !== priority) return false;
    if (categoryId && t.categoryId !== categoryId) return false;
    return true;
  });
}

export function sortTasks(tasks, sortBy = 'createdAt', dir = 'desc') {
  return [...tasks].sort((a, b) => {
    let av = a[sortBy], bv = b[sortBy];
    if (sortBy === 'priority') {
      const order = { urgent: 4, high: 3, medium: 2, low: 1 };
      av = order[av] || 0; bv = order[bv] || 0;
    }
    if (sortBy === 'dueDate') {
      av = av ? new Date(av).getTime() : Infinity;
      bv = bv ? new Date(bv).getTime() : Infinity;
    }
    if (typeof av === 'string') {
      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return dir === 'asc' ? av - bv : bv - av;
  });
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const overdue = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, inProgress, todo, overdue, completionRate };
}

export function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export function getWeeklyData(tasks) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: format(d, 'EEE'),
      date: format(d, 'yyyy-MM-dd'),
      completed: 0,
      created: 0,
    };
  });
  tasks.forEach(t => {
    const createdDate = t.createdAt?.slice(0, 10);
    const completedDate = t.status === 'completed' ? t.dueDate?.slice(0, 10) : null;
    const c = days.find(d => d.date === createdDate);
    if (c) c.created++;
    const cp = completedDate ? days.find(d => d.date === completedDate) : null;
    if (cp) cp.completed++;
  });
  return days;
}
