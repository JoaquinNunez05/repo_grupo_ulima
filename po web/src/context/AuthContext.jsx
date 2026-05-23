import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const activeUser = localStorage.getItem('techgear_current_user');
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const user = await res.json();
        // Match the legacy 'isAdmin' property for the frontend
        const normalizedUser = { ...user, isAdmin: user.role === 'admin' };
        setCurrentUser(normalizedUser);
        localStorage.setItem('techgear_current_user', JSON.stringify(normalizedUser));
        return { success: true };
      }
      return { success: false, message: 'Credenciales inválidas' };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const newUser = await res.json();
        const normalizedUser = { ...newUser, isAdmin: newUser.role === 'admin' };
        setCurrentUser(normalizedUser);
        localStorage.setItem('techgear_current_user', JSON.stringify(normalizedUser));
        return { success: true };
      }
      return { success: false, message: 'El correo ya está registrado o error' };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('techgear_current_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
