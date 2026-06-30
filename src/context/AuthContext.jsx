import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS_KEY = 'tf_users';
const CURRENT_USER_KEY = 'tf_current_user';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }, [user]);

  const login = async (email, password) => {
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 100));
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      setError('Invalid email or password.');
      setLoading(false);
      return false;
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    setLoading(false);
    return true;
  };

  const signup = async (name, email, password) => {
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 100));
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists.');
      setLoading(false);
      return false;
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name, email, password,
      avatar: null,
      bio: '',
      joinedAt: new Date().toISOString(),
      notifications: { email: true, browser: true, taskReminders: true },
    };
    saveUsers([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveUsers(users);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
