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
    
    
    
    const storedUsers = localStorage.getItem('techgear_users');
    if (!storedUsers) {
      
      const defaultUsers = [{
        id: 1,
        name: 'Admin',
        email: 'admin@techgear.com',
        password: 'admin',
        isAdmin: true
      }];
      localStorage.setItem('techgear_users', JSON.stringify(defaultUsers));
    }
  }, []);
//funcion para iniciar sesion
  const login = async (email, password) => {
    return new Promise((resolve) => {
      
      setTimeout(() => {
        //obtiene usuarios guardados
        const storedUsers = JSON.parse(localStorage.getItem('techgear_users') || '[]');
        //busca un usuario que coincida
        const user = storedUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('techgear_current_user', JSON.stringify(userWithoutPassword));
          resolve({ success: true });
        } else {
          resolve({ success: false, message: 'Credenciales inválidas' });
        }
      }, 500);
    });
  };
//funcion para registrar usuarios
  const register = async (name, email, password) => {

    return new Promise((resolve) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('techgear_users') || '[]');
        //verifica si hay algun correo repetido
        if (storedUsers.some(u => u.email === email)) {
          resolve({ success: false, message: 'El correo ya está registrado' });
          return;
        }

        const newUser = {
          id: Date.now(),
          name,
          email,
          password,
          isAdmin: false
        };
        //agrega el usuario creado al arreglo
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('techgear_users', JSON.stringify(updatedUsers));
        
        const { password: _, ...userWithoutPassword } = newUser;
        
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('techgear_current_user', JSON.stringify(userWithoutPassword));
        
        resolve({ success: true });
      }, 500);
    });
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
