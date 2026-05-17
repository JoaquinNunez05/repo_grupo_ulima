import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Cargar usuarios registrados y sesión activa
    const storedUsers = localStorage.getItem('techgear_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Usuario administrador por defecto para probar el Dashboard
      const initialUsers = [{ name: 'Admin', email: 'admin@techgear.com', password: 'admin', isAdmin: true }];
      setUsers(initialUsers);
      localStorage.setItem('techgear_users', JSON.stringify(initialUsers));
    }

    const activeUser = localStorage.getItem('techgear_current_user');
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);

  const login = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('techgear_current_user', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  const register = (name, email, password) => {
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }
    const newUser = { name, email, password, isAdmin: false };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('techgear_users', JSON.stringify(updatedUsers));
    
    // Auto-login después de registro
    setCurrentUser(newUser);
    localStorage.setItem('techgear_current_user', JSON.stringify(newUser));
    return { success: true };
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
