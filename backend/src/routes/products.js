import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Crear un nuevo producto (Usualmente solo Admin, pero abierto para este proyecto)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, image, description } = req.body;

    // Generar un ID simple como prod_7
    const productCount = await Product.count();
    const newId = `prod_${productCount + 1}`;

    const newProduct = await Product.create({
      id: newId,
      name,
      category,
      price,
      stock,
      image,
      description
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Actualizar stock de producto (al comprar)
router.put('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const newStock = Math.max(0, product.stock - quantity);
    await product.update({ stock: newStock });

    res.json(product);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Error al actualizar stock' });
  }
});

export default router;
