import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays, addHours } from 'date-fns';

const now = new Date();

export const SEED_CATEGORIES = [
  { id: 'cat_1', name: 'Development', color: '#6C63FF', icon: '💻' },
  { id: 'cat_2', name: 'Design',      color: '#FF6584', icon: '🎨' },
  { id: 'cat_3', name: 'Marketing',   color: '#F59E0B', icon: '📣' },
  { id: 'cat_4', name: 'Research',    color: '#10B981', icon: '🔬' },
  { id: 'cat_5', name: 'Personal',    color: '#3B82F6', icon: '🌟' },
];

export const SEED_TASKS = [];
