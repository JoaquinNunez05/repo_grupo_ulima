import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);

  //se ejecuta una sola vez cuando el componente carga
  useEffect(() => {
    //busca si hay usuario registrado
    const activeUser = localStorage.getItem('techgear_current_user');
    if (activeUser) {
      setCurrentUser(JSON.parse(activeUser));
    }
  }, []);
  //funcion para iniciar sesion
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('techgear_current_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Error de conexión al servidor' };
    }
  };
  //funcion para registrar usuarios
  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('techgear_current_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error registering:', error);
      return { success: false, message: 'Error de conexión al servidor' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('techgear_current_user');
  };
  //se comparte toda la informacion
  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
