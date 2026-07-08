import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Importar Modelos para definir relaciones y sincronizar
import User from './models/User.js';
import Product from './models/Product.js';
import CartItem from './models/CartItem.js';

// Importar Rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Sincronización de Base de Datos e Inicio del Servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connected via Sequelize.');

    // Sincronizar modelos (crea tablas si no existen)
    // Force: false significa que no eliminará tablas si ya existen
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');

    // Crear productos iniciales si la tabla está vacía
    const productCount = await Product.count();
    if (productCount === 0) {
      console.log('Seeding initial products...');
      const initialProducts = [
        {
          id: "prod_1",
          name: "Nova Pro Mechanical Keyboard",
          category: "Teclados",
          price: 759.90,
          stock: 15,
          image: "/src/img/Nova Pro Mechanical Keyboard.jpg",
          description: "Teclado mecánico de formato 75% con switches lineales ópticos, iluminación RGB por tecla y chasis de aluminio de grado aeroespacial."
        },
        {
          id: "prod_2",
          name: "Apex Wireless Gaming Mouse",
          category: "Mouses",
          price: 495.90,
          stock: 25,
          image: "/src/img/Apex Wireless Gaming Mouse.jpg",
          description: "Mouse inalámbrico ultraligero de 55g con sensor de 26K DPI, switches ópticos y batería de 80 horas de duración."
        },
        {
          id: "prod_3",
          name: "Audífonos inalambricos Sony Wh-1000xm5",
          category: "Headsets",
          price: 949.90,
          stock: 10,
          image: "/src/img/Audífonos inalambricos Sony Wh-1000xm5.jpg",
          description: "Audífonos premium con sonido envolvente 7.1 espacial, almohadillas de memory foam con gel refrigerante y micrófono con cancelación de ruido."
        },
        {
          id: "prod_4",
          name: "Phantom TKL RGB",
          category: "Teclados",
          price: 569.90,
          stock: 8,
          image: "/src/img/Phantom TKL RGB.jpg",
          description: "Teclado Tenkeyless para esports con switches táctiles, keycaps PBT double-shot y polling rate de 8000Hz."
        },
        {
          id: "prod_5",
          name: "Precision Ergonomic Mouse",
          category: "Mouses",
          price: 349.90,
          stock: 30,
          image: "/src/img/Precision Ergonomic Mouse.png",
          description: "Diseño ergonómico para largas sesiones, 6 botones programables y sensor de alta precisión ideal para shooters."
        },
        {
          id: "prod_6",
          name: "Echo Core Stereo Headset",
          category: "Headsets",
          price: 419.90,
          stock: 20,
          image: "/src/img/Echo Core Stereo Headset.jpg",
          description: "Sonido estéreo inmersivo con drivers de 50mm, diseño ultraligero y conectividad multiplataforma."
        }
      ];
      await Product.bulkCreate(initialProducts);
      console.log('Initial products seeded.');
    }

    // Crear usuario administrador si no existe
    const adminExists = await User.findOne({ where: { email: 'admin@techgear.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@techgear.com',
        password: 'admin',
        isAdmin: true
      });
      console.log('Admin user seeded.');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
