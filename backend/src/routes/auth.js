import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // Crear usuario (Nota: ¡En una aplicación real, encripta la contraseña!)
    const newUser = await User.create({
      name,
      email,
      password,
      isAdmin: false
    });

    // No devolver la contraseña
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    };

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email, password } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;
