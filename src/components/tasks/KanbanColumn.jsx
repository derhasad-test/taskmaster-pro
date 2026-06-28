import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import styles from './KanbanColumn.module.css';

const COLUMN_META = {
  'todo':        { label: 'To Do',       emoji: '📋', color: 'var(--color-info)' },
  'in-progress': { label: 'In Progress', emoji: '⚡', color: 'var(--color-warning)' },
  'completed':   { label: 'Completed',   emoji: '✅', color: 'var(--color-success)' },
};

export default function KanbanColumn({ id, tasks, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const meta = COLUMN_META[id] || { label: id, emoji: '📌', color: 'var(--color-primary)' };

  return (
    <div className={`${styles.column} ${isOver ? styles.over : ''}`}>
      {/* Column Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.emoji}>{meta.emoji}</span>
          <h3 className={styles.title}>{meta.label}</h3>
          <span className={styles.count} style={{ background: `${meta.color}20`, color: meta.color }}>
            {tasks.length}
          </span>
        </div>
        <button className={styles.addBtn} onClick={() => onAddTask(id)} aria-label={`Add task to ${meta.label}`} title="Add task">
          <Plus size={16} />
        </button>
      </div>

      {/* Indicator line */}
      <div className={styles.indicator} style={{ background: meta.color }} />

      {/* Tasks */}
      <div ref={setNodeRef} className={styles.taskList}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>{meta.emoji}</span>
            <p>No tasks here</p>
            <button className={styles.emptyAdd} onClick={() => onAddTask(id)}>
              <Plus size={14} /> Add task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
