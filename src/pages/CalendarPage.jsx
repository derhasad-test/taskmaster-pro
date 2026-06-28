import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../components/ui/Badge';
import { formatDate } from '../utils/taskUtils';
import styles from './CalendarPage.module.css';

const localizer = dateFnsLocalizer({
  format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay, locales: { 'en-US': enUS },
});

const PRIORITY_EVENT_COLORS = {
  urgent: '#7C3AED', high: '#EF4444', medium: '#F59E0B', low: '#10B981',
};

export default function CalendarPage() {
  const { tasks, categories } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const events = useMemo(() =>
    tasks
      .filter(t => t.dueDate)
      .map(t => ({
        id: t.id,
        title: t.title,
        start: new Date(t.dueDate),
        end: new Date(t.dueDate),
        allDay: true,
        resource: t,
      })),
    [tasks]
  );

  const eventStyleGetter = (event) => {
    const task = event.resource;
    const color = PRIORITY_EVENT_COLORS[task.priority] || '#6C63FF';
    return {
      style: {
        background: color,
        borderRadius: '6px',
        border: 'none',
        color: '#fff',
        fontSize: '12px',
        padding: '2px 6px',
        opacity: task.status === 'completed' ? 0.5 : 1,
      }
    };
  };

  const handleSelectEvent = (event) => setSelectedTask(event.resource);

  const task = selectedTask;
  const category = task ? categories.find(c => c.id === task?.categoryId) : null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Calendar</h1>
        <p className={styles.sub}>View tasks by due date. Click any event to see details.</p>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {Object.entries(PRIORITY_EVENT_COLORS).map(([p, c]) => (
          <div key={p} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: c }} />
            <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
          </div>
        ))}
        <span className={styles.legendSep}>·</span>
        <span className={styles.legendNote}>Faded = completed</span>
      </div>

      <div className={styles.calWrapper}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          popup
        />
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title="Task Details"
          size="sm"
          footer={
            <>
              <button
                style={{ padding: '8px 16px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}
                onClick={() => setSelectedTask(null)}
              >Close</button>
              <button
                style={{ padding: '8px 16px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                onClick={() => { setShowEdit(true); }}
              >Edit Task</button>
            </>
          }
        >
          <div className={styles.taskDetail}>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            {task.description && <p className={styles.taskDesc}>{task.description}</p>}
            <div className={styles.taskMeta}>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {category && <CategoryBadge category={category} />}
            </div>
            {task.dueDate && (
              <div className={styles.taskDue}>
                📅 Due: <strong>{formatDate(task.dueDate)}</strong>
              </div>
            )}
            {task.subtasks?.length > 0 && (
              <div className={styles.taskSubtasks}>
                <strong>{task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks done</strong>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showEdit && selectedTask && (
        <TaskForm
          isOpen={showEdit}
          onClose={() => { setShowEdit(false); setSelectedTask(null); }}
          task={selectedTask}
        />
      )}
    </div>
  );
}
