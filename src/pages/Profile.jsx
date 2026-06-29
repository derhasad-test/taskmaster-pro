import { useState, useRef } from 'react';
import { Camera, User, Mail, FileText, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { getTaskStats } from '../utils/taskUtils';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { tasks } = useTasks();
  const { addToast } = useToast();
  const stats = getTaskStats(tasks);
  const fileRef = useRef();

  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [saving, setSaving] = useState(false);

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateProfile({ name: form.name, bio: form.bio, avatar });
    addToast('Profile updated!', 'success');
    setSaving(false);
  };

  const joinDate = user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';
  const passwordCreatedDate = user?.passwordCreatedAt ? new Date(user.passwordCreatedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) : 'N/A';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.layout}>
        {/* Left: Avatar + stats */}
        <div className={styles.leftCol}>
          <div className={styles.avatarCard}>
            <div className={styles.avatarWrap}>
              <Avatar name={form.name || user?.name} src={avatar} size="xl" />
              <button className={styles.avatarEdit} onClick={() => fileRef.current.click()} aria-label="Change avatar">
                <Camera size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>
            <h2 className={styles.name}>{user?.name}</h2>
            <p className={styles.email}>{user?.email}</p>
            <p className={styles.joined}>Member since {joinDate}</p>
            <p className={styles.joined}>Password created {passwordCreatedDate}</p>
          </div>

          {/* Stats */}
          <div className={styles.statsCard}>
            <h3 className={styles.statsTitle}>Your Stats</h3>
            <div className={styles.statsGrid}>
              {[
                { label: 'Total Tasks',  value: stats.total },
                { label: 'Completed',    value: stats.completed },
                { label: 'In Progress',  value: stats.inProgress },
                { label: 'Overdue',      value: stats.overdue },
              ].map(s => (
                <div key={s.label} className={styles.statItem}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLab}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>Completion Rate</span>
              <span className={styles.progressValue}>{stats.completionRate}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${stats.completionRate}%` }} />
            </div>
          </div>
        </div>

        {/* Right: Edit form */}
        <div className={styles.rightCol}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Edit Profile</h3>

            <div className={styles.fields}>
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={form.name}
                onChange={set('name')}
                leftIcon={<User size={16} />}
              />
              <div className={styles.readonlyField}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.readonlyInput}>
                  <Mail size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <span>{user?.email}</span>
                  <span className={styles.readonlyNote}>Cannot be changed</span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Bio</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Tell us a bit about yourself..."
                  value={form.bio}
                  onChange={set('bio')}
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <Button variant="primary" loading={saving} onClick={handleSave}>
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
