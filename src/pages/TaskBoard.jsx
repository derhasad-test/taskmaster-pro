import { useState } from 'react';
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Filter, SortDesc, Search } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import { filterTasks, STATUSES, PRIORITIES, PRIORITY_LABELS } from '../utils/taskUtils';
import styles from './TaskBoard.module.css';

const COLUMNS = ['todo', 'in-progress', 'completed'];

export default function TaskBoard() {
  const { tasks, moveTask, updateTask, reorderTasks } = useTasks();
  const { categories } = useTasks();
  const { addToast } = useToast();
  const [activeTask, setActiveTask] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [filters, setFilters] = useState({ search: '', priority: '', categoryId: '' });
  const [showFilters, setShowFilters] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const filtered = filterTasks(tasks, filters);
  const byColumn = (status) => filtered.filter(t => t.status === status);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id) || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const taskId = active.id;
    const overId  = over.id;

    // Check if over a column
    if (COLUMNS.includes(overId)) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== overId) {
        moveTask(taskId, overId);
        addToast(`Task moved to "${overId === 'in-progress' ? 'In Progress' : overId === 'completed' ? 'Completed' : 'To Do'}"`, 'success');
      }
      return;
    }

    // Over another task — determine column
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        if (task.status !== overTask.status) {
          reorderTasks(taskId, overId, overTask.status);
          addToast(`Task moved to "${overTask.status === 'in-progress' ? 'In Progress' : overTask.status === 'completed' ? 'Completed' : 'To Do'}"`, 'success');
        } else {
          reorderTasks(taskId, overId);
        }
      }
    }
  };

  const handleAddForColumn = (status) => {
    setDefaultStatus(status);
    setShowAdd(true);
  };

  const setFilter = (key) => (e) => setFilters(f => ({ ...f, [key]: e.target.value }));
  const clearFilters = () => setFilters({ search: '', priority: '', categoryId: '' });
  const hasFilters = filters.search || filters.priority || filters.categoryId;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Task Board</h1>
          <p className={styles.sub}>{tasks.length} total tasks · Drag cards between columns</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`} onClick={() => setShowFilters(v => !v)}>
            <Filter size={16} /> Filters {hasFilters && <span className={styles.filterDot} />}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={15} />
            <input
              type="text" placeholder="Search tasks..."
              value={filters.search} onChange={setFilter('search')}
              className={styles.searchInput}
            />
          </div>
          <select className={styles.filterSelect} value={filters.priority} onChange={setFilter('priority')}>
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </select>
          <select className={styles.filterSelect} value={filters.categoryId} onChange={setFilter('categoryId')}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          {hasFilters && (
            <button className={styles.clearBtn} onClick={clearFilters}>Clear filters</button>
          )}
        </div>
      )}

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col}
              id={col}
              tasks={byColumn(col)}
              onAddTask={handleAddForColumn}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} isDragOverlay />}
        </DragOverlay>
      </DndContext>

      {showAdd && (
        <TaskForm
          isOpen={showAdd}
          onClose={() => setShowAdd(false)}
          task={{ status: defaultStatus }}
        />
      )}
    </div>
  );
}
