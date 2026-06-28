import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SEED_TASKS, SEED_CATEGORIES } from '../data/seedData';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

const TASKS_KEY = (uid) => `tf_tasks_${uid || 'guest'}`;
const CATS_KEY  = (uid) => `tf_cats_${uid || 'guest'}`;

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, tasks: action.tasks, categories: action.categories, loaded: true };

    case 'CLEAR_TASKS':
      return { ...state, tasks: [] };

    case 'ADD_TASK': {
      const task = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description || '',
        status: action.payload.status || 'todo',
        priority: action.payload.priority || 'medium',
        categoryId: action.payload.categoryId || null,
        dueDate: action.payload.dueDate || null,
        tags: action.payload.tags || [],
        subtasks: action.payload.subtasks || [],
        createdAt: new Date().toISOString(),
      };
      return { ...state, tasks: [task, ...state.tasks] };
    }

    case 'UPDATE_TASK': {
      const tasks = state.tasks.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
      );
      return { ...state, tasks };
    }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) };

    case 'MOVE_TASK': {
      const tasks = state.tasks.map(t =>
        t.id === action.id ? { ...t, status: action.status } : t
      );
      return { ...state, tasks };
    }

    case 'REORDER_TASKS': {
      const { taskId, overId, newStatus } = action;
      const oldIndex = state.tasks.findIndex(t => t.id === taskId);
      if (oldIndex === -1) return state;

      const newTasks = [...state.tasks];
      // Remote the item
      const [moved] = newTasks.splice(oldIndex, 1);
      
      // Update status if it changed columns
      if (newStatus) {
        moved.status = newStatus;
      }
      
      let newIndex = newTasks.findIndex(t => t.id === overId);
      if (newIndex === -1) newIndex = newTasks.length;

      // Insert at new position
      newTasks.splice(newIndex, 0, moved);
      return { ...state, tasks: newTasks };
    }

    case 'TOGGLE_SUBTASK': {
      const tasks = state.tasks.map(t => {
        if (t.id !== action.taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map(s =>
            s.id === action.subtaskId ? { ...s, done: !s.done } : s
          ),
        };
      });
      return { ...state, tasks };
    }

    case 'ADD_CATEGORY': {
      const cat = { id: uuidv4(), ...action.payload };
      return { ...state, categories: [...state.categories, cat] };
    }

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.id),
        tasks: state.tasks.map(t =>
          t.categoryId === action.id ? { ...t, categoryId: null } : t
        ),
      };

    default: return state;
  }
}

const initialState = { tasks: [], categories: [], loaded: false };

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load or seed data when user changes
  useEffect(() => {
    const uid = user?.id || 'guest';
    const tKey = TASKS_KEY(uid);
    const cKey = CATS_KEY(uid);
    const storedTasks = loadFromStorage(tKey, null);
    const storedCats  = loadFromStorage(cKey, null);
    if (storedTasks === null) {
      // First login — seed data
      dispatch({ type: 'INIT', tasks: SEED_TASKS, categories: SEED_CATEGORIES });
    } else {
      dispatch({ type: 'INIT', tasks: storedTasks, categories: storedCats || SEED_CATEGORIES });
    }
  }, [user?.id]);

  // Persist to localStorage whenever tasks/categories change
  useEffect(() => {
    if (!state.loaded) return;
    const uid = user?.id || 'guest';
    localStorage.setItem(TASKS_KEY(uid), JSON.stringify(state.tasks));
    localStorage.setItem(CATS_KEY(uid),  JSON.stringify(state.categories));
  }, [state.tasks, state.categories, state.loaded, user?.id]);

  const addTask    = (payload) => dispatch({ type: 'ADD_TASK', payload });
  const updateTask = (id, updates) => dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  const deleteTask = (id) => dispatch({ type: 'DELETE_TASK', id });
  const moveTask   = (id, status) => dispatch({ type: 'MOVE_TASK', id, status });
  const reorderTasks = (taskId, overId, newStatus) => dispatch({ type: 'REORDER_TASKS', taskId, overId, newStatus });
  const clearAllTasks = () => dispatch({ type: 'CLEAR_TASKS' });
  const toggleSubtask = (taskId, subtaskId) => dispatch({ type: 'TOGGLE_SUBTASK', taskId, subtaskId });
  const addCategory    = (payload) => dispatch({ type: 'ADD_CATEGORY', payload });
  const deleteCategory = (id) => dispatch({ type: 'DELETE_CATEGORY', id });

  return (
    <TaskContext.Provider value={{
      tasks: state.tasks,
      categories: state.categories,
      loaded: state.loaded,
      addTask, updateTask, deleteTask, moveTask, reorderTasks, clearAllTasks,
      toggleSubtask, addCategory, deleteCategory,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
