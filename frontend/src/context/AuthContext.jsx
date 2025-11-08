import React, { createContext, useState, useContext } from 'react';
import { login as loginService } from '../api/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    return token ? { isAuthenticated: true } : null;
  });

  const handleLogin = async (username, password) => {
    try {
      await loginService(username, password);
      setUser({ isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Falha no login", error);
      localStorage.removeItem('authToken');
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = { user, onLogin: handleLogin, onLogout: handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};