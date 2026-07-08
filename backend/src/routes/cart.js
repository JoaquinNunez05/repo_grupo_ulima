import express from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

const router = express.Router();

// Obtener carrito para un usuario específico
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }]
    });

    // Formatear respuesta para coincidir con lo esperado en el frontend
    const formattedCart = cartItems.map(item => ({
      ...item.Product.toJSON(),
      quantity: item.quantity,
      cartItemId: item.id
    }));

    res.json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error al obtener carrito' });
  }
});

// Agregar artículo al carrito
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Verificar si el artículo ya está en el carrito
    let cartItem = await CartItem.findOne({ where: { userId, productId } });

    if (cartItem) {
      // Actualizar cantidad
      cartItem.quantity += (quantity || 1);
      await cartItem.save();
    } else {
      // Crear nuevo artículo en el carrito
      cartItem = await CartItem.create({ userId, productId, quantity: quantity || 1 });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
});

// Actualizar cantidad del artículo
router.put('/update', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0' });
    }

    const cartItem = await CartItem.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.json(cartItem);
    } else {
      res.status(404).json({ message: 'Item no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ message: 'Error al actualizar cantidad' });
  }
});

// Eliminar artículo del carrito
router.delete('/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await CartItem.destroy({ where: { userId, productId } });

    res.json({ success: true, message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

// Vaciar carrito
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await CartItem.destroy({ where: { userId } });
    res.json({ success: true, message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error al vaciar carrito' });
  }
});

export default router;
