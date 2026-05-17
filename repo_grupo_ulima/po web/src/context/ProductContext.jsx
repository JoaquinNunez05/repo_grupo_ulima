import { createContext, useState, useEffect } from 'react';
import initialProducts from '../data/initialProducts.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Cargar productos del localStorage o usar mock inicial
    const storedProducts = localStorage.getItem('techgear_products_v2');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('techgear_products_v2', JSON.stringify(initialProducts));
    }
  }, []);

  const addProduct = (newProduct) => {
    const updatedProducts = [...products, { ...newProduct, id: `prod_${Date.now()}` }];
    setProducts(updatedProducts);
    localStorage.setItem('techgear_products_v2', JSON.stringify(updatedProducts));
  };

  const updateProductStock = (productId, quantity) => {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, stock: p.stock - quantity } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('techgear_products_v2', JSON.stringify(updatedProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProductStock }}>
      {children}
    </ProductContext.Provider>
  );
};
