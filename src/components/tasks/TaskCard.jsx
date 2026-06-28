import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical, Edit2, Trash2, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import { PriorityBadge, CategoryBadge, TagBadge } from '../ui/Badge';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, getDueDateStatus, isOverdue } from '../../utils/taskUtils';
import TaskForm from './TaskForm';
import styles from './TaskCard.module.css';

export default function TaskCard({ task, isDragOverlay = false }) {
  const { deleteTask, updateTask, toggleSubtask, categories } = useTasks();
  const { addToast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const category = categories.find(c => c.id === task.categoryId);
  const dueDateStatus = getDueDateStatus(task.dueDate);
  const completedSubtasks = task.subtasks?.filter(s => s.done).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const isCompleted = task.status === 'completed';

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task.id, disabled: isDragOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleToggleComplete = () => {
    updateTask(task.id, { status: isCompleted ? 'todo' : 'completed' });
    addToast(isCompleted ? 'Task reopened' : 'Task completed! 🎉', isCompleted ? 'info' : 'success');
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    deleteTask(task.id);
    addToast('Task deleted', 'info');
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.card} ${isCompleted ? styles.completed : ''} ${isDragging ? styles.dragging : ''}`}
      >
        {/* Drag handle */}
        <div className={styles.dragHandle} {...attributes} {...listeners} title="Drag to reorder">
          <GripVertical size={14} />
        </div>

        {/* Header */}
        <div className={styles.header}>
          <button className={styles.completeBtn} onClick={handleToggleComplete} aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}>
            {isCompleted
              ? <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
              : <Circle size={18} style={{ color: 'var(--text-tertiary)' }} />}
          </button>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => setShowEdit(true)} aria-label="Edit task" title="Edit">
              <Edit2 size={14} />
            </button>
            <button
              className={`${styles.actionBtn} ${confirmDelete ? styles.confirmDelete : ''}`}
              onClick={handleDelete}
              aria-label="Delete task"
              title={confirmDelete ? 'Click again to confirm' : 'Delete'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className={`${styles.title} ${isCompleted ? styles.done : ''}`}>{task.title}</h3>

        {/* Description */}
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        {/* Badges */}
        <div className={styles.badges}>
          <PriorityBadge priority={task.priority} />
          {category && <CategoryBadge category={category} />}
        </div>

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className={styles.tags}>
            {task.tags.slice(0, 3).map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>
        )}

        {/* Subtasks */}
        {totalSubtasks > 0 && (
          <div className={styles.subtasks}>
            <button
              className={styles.subtaskToggle}
              onClick={() => setShowSubtasks(v => !v)}
              title={showSubtasks ? 'Hide breakdown' : 'Show breakdown'}
            >
              <div className={styles.subtaskHeader}>
                <span className={styles.subtaskLabel}>TASK BREAKDOWN</span>
                <span className={styles.progressText}>{completedSubtasks}/{totalSubtasks}</span>
              </div>
              <div className={styles.subtaskProgress}>
                <div
                  className={styles.subtaskBar}
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
              <ChevronDown size={14} className={styles.toggleIcon} style={{ transform: showSubtasks ? 'rotate(180deg)' : 'none' }} />
            </button>
            {showSubtasks && (
              <div className={styles.subtaskList}>
                {task.subtasks.map(s => (
                  <label key={s.id} className={styles.subtaskItem}>
                    <div className={styles.checkWrapper}>
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={() => toggleSubtask(task.id, s.id)}
                        className={styles.subtaskCheck}
                      />
                      <div className={styles.customCheck} />
                    </div>
                    <span className={`${styles.subtaskText} ${s.done ? styles.subtaskDone : ''}`}>{s.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {task.dueDate && (
          <div className={`${styles.dueDate} ${styles[dueDateStatus]}`}>
            <Calendar size={12} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {showEdit && (
        <TaskForm isOpen={showEdit} onClose={() => setShowEdit(false)} task={task} />
      )}
    </>
  );
}
