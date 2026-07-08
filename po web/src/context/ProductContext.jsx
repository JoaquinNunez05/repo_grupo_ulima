import { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // add prods
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        // Refresh products after adding
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // actu stock
  const updateProductStock = async (productId, quantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        // Optimistically update local state for faster UI
        setProducts(products.map(p =>
          p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p
        ));
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  };

  return (

    // Compartimos datos y funciones globalmente
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProductStock
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};