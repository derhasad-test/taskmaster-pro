import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { PRIORITIES, STATUSES, PRIORITY_LABELS, STATUS_LABELS } from '../../utils/taskUtils';
import styles from './TaskForm.module.css';

const DEFAULT = {
  title: '', description: '', status: 'todo', priority: 'medium',
  categoryId: '', dueDate: '', tags: '', subtasks: [],
};

export default function TaskForm({ isOpen, onClose, task = null }) {
  const { addTask, updateTask, categories } = useTasks();
  const { addToast } = useToast();
  const isEdit = Boolean(task && task.id);

  const [form, setForm] = useState(() => {
    const base = { ...DEFAULT, ...(task || {}) };
    return {
      ...base,
      dueDate: base.dueDate ? base.dueDate.slice(0, 10) : '',
      tags: Array.isArray(base.tags) ? base.tags.join(', ') : '',
      subtasks: base.subtasks || [],
    };
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    if (isEdit) { updateTask(task.id, payload); addToast('Task updated successfully!', 'success'); }
    else { addTask(payload); addToast('Task created!', 'success'); }
    setLoading(false);
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setForm(f => ({ ...f, subtasks: [...f.subtasks, { id: uuidv4(), title: newSubtask.trim(), done: false }] }));
    setNewSubtask('');
  };
  const removeSubtask = (id) => setForm(f => ({ ...f, subtasks: f.subtasks.filter(s => s.id !== id) }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          label="Task Title *"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={set('title')}
          error={errors.title}
          autoFocus
        />

        <Input
          label="Description"
          placeholder="Add more details..."
          as="textarea"
          value={form.description}
          onChange={set('description')}
        />

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select className={styles.select} value={form.status} onChange={set('status')}>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Priority</label>
            <select className={styles.select} value={form.priority} onChange={set('priority')}>
              {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={form.categoryId} onChange={set('categoryId')}>
              <option value="">No Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              className={styles.select}
              value={form.dueDate}
              onChange={set('dueDate')}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>

        <Input
          label="Tags (comma separated)"
          placeholder="e.g. frontend, urgent, bug"
          value={form.tags}
          onChange={set('tags')}
        />

        {/* Subtasks */}
        <div className={styles.subtaskSection}>
          <label className={styles.label}>Subtasks</label>
          <div className={styles.subtaskList}>
            {form.subtasks.map(s => (
              <div key={s.id} className={styles.subtaskItem}>
                <span className={styles.subtaskTitle}>{s.title}</span>
                <button type="button" className={styles.subtaskRemove} onClick={() => removeSubtask(s.id)}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.subtaskAdd}>
            <input
              type="text"
              className={styles.subtaskInput}
              placeholder="Add subtask..."
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
            />
            <button type="button" className={styles.subtaskBtn} onClick={addSubtask}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
