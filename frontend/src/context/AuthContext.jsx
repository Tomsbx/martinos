import { createContext, useContext, useState } from 'react';
import { login as apiLogin } from '../api/adminApi';

const TOKEN_KEY = 'martinos_admin_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  async function login(username, password) {
    const data = await apiLogin(username, password);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
