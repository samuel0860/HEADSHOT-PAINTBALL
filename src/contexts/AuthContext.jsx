import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'paintball123',
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return storage.get('auth_token') === 'headshot_admin_2026';
  });
  const [adminUser, setAdminUser] = useState(() => {
    return storage.get('admin_user', null);
  });

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user = { username, nome: 'Administrador', role: 'admin' };
      storage.set('auth_token', 'headshot_admin_2026');
      storage.set('admin_user', user);
      setIsAuthenticated(true);
      setAdminUser(user);
      return { success: true };
    }
    return { success: false, message: 'Usuário ou senha incorretos.' };
  };

  const logout = () => {
    storage.remove('auth_token');
    storage.remove('admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
