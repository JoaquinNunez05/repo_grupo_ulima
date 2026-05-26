import { createContext, useState, useEffect, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  //se ejecuta cuando el componente carga
  useEffect(() => {
    //busca si hay carrito guardado
    const storedCart = localStorage.getItem('techgear_cart_v2');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
  //agrega productos al carrito
  const addToCart = (product, quantity = 1) => {
    //busca si el prod ya esta en el carrito
    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedCart;
    //actu cant
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      //agrega nuevo prod
      updatedCart = [...cartItems, { ...product, quantity }];
    }
    //guarda
    setCartItems(updatedCart);
    localStorage.setItem('techgear_cart_v2', JSON.stringify(updatedCart));
  };
  //elimina
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('techgear_cart_v2', JSON.stringify(updatedCart));
  };
  //actu cant 
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    //actu cant con map (para modificar solo 1 y mantener los demas)
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('techgear_cart_v2', JSON.stringify(updatedCart));
  };
  //vacia el carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('techgear_cart_v2');
  };
  //se usa memo para no recalcular, solo cuando cambia
  const { cartTotal, cartSubtotal } = useMemo(() => {
    //reduce para recorrer un arreglo y convertirlo en un valor final
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Asumiremos que el total es igual al subtotal para simplificar, o añadir un tax
    return { cartSubtotal: subtotal, cartTotal: subtotal * 1.15 }; // 15% IVA
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
