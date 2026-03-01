import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import React from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await api.get('/auth/me', { silent: true });
    if (data.success) setUser(data.user);
    return data.user;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me', { silent: true }).then(({ data }) => {
        if (data.success) setUser(data.user);
      }).catch(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.success) {
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (patch) => {
    const { data } = await api.patch('/users/me', patch);
    if (data.success) setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
