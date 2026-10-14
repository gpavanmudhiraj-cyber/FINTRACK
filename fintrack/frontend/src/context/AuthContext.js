import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fintrack_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fintrack_token');
    if (!token) {
      setLoading(false);
      return;
    }
    API.get('/auth/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('fintrack_user', JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem('fintrack_token');
        localStorage.removeItem('fintrack_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const theme = user?.theme || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [user]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('fintrack_token', res.data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await API.post('/auth/register', { name, email, password, confirmPassword });
    localStorage.setItem('fintrack_token', res.data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
    setUser(null);
  };

  const updateUser = (partial) => {
    const updated = { ...user, ...partial };
    localStorage.setItem('fintrack_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);