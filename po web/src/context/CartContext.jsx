import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${currentUser.id}`);
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [currentUser]);
  //agrega productos al carrito
  const addToCart = async (product, quantity = 1) => {
    if (!currentUser) return; // Need to be logged in to add to cart now

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, productId: product.id, quantity }),
      });
      if (response.ok) fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  //elimina
  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    try {
      const response = await fetch('http://localhost:5000/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, productId }),
      });
      if (response.ok) fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  //actu cant 
  const updateQuantity = async (productId, quantity) => {
    if (!currentUser || quantity < 1) return;
    try {
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, productId, quantity }),
      });
      if (response.ok) fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  //vacia el carrito
  const clearCart = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`http://localhost:5000/api/cart/clear/${currentUser.id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  //se usa memo para no recalcular, solo cuando cambia
  const { cartTotal, cartSubtotal } = useMemo(() => {
    //reduce para recorrer un arreglo y convertirlo en un valor final
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { cartSubtotal: subtotal, cartTotal: subtotal * 1.15 };
  }, [cartItems]);
  //datos compartidos
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
