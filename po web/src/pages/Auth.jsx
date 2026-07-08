import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {

  
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({

    name: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      
      ...formData,
      
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    // Evita recargar página
    e.preventDefault();
    // Limpia errores
    setError('');

    // LOGIN
    if (isLogin) {

      // Intenta iniciar sesión
      const res = await login(
        formData.email,
        formData.password
      );

      // Si login correcto
      if (res.success) {
        navigate('/');
      } else {
        alert('Usuario no encontrado');
        setError('Usuario no encontrado');
      }
    }
    // REGISTRO
    else {
      // Valida campos vacíos
      if (
        !formData.name ||
        !formData.email ||
        !formData.password
      ) {
        setError('Todos los campos son obligatorios');
        return;
      }
      // Intenta registrar usuario
      const res = await register(
        formData.name,
        formData.email,
        formData.password
      );
      if (res.success) {
        // Redirecciona al inicio
        navigate('/');
      } else {
        alert('Usuario ya registrado');
        setError('Usuario ya registrado');
      }
    }
  };

  return (
    <div className="auth-page container page-container animate-fade-in">
      <div className="auth-card glass">
        <h2 className="auth-title">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
