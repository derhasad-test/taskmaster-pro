import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const [taskTitle, setTaskTitle] = useState('');
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    addTask({
      title: taskTitle.trim(),
    });
    
    navigate('/board');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} size={48} />
        </div>
        <h1 className={styles.greeting}>What do you want to achieve today?</h1>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type your task and press Enter..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className={styles.button} disabled={!taskTitle.trim()}>
            <ArrowRight size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
