import { createContext, useState, useEffect } from 'react';
import initialProducts from '../data/initialProducts.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setProducts(initialProducts);
        }
      } catch (error) {
        console.error("Error fetching products, falling back to local data:", error);
        setProducts(initialProducts);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const addedProduct = await res.json();
        setProducts([...products, addedProduct]);
      } else {
        throw new Error("Backend response not ok");
      }
    } catch (error) {
      console.error("Error adding product, falling back to local state:", error);
      const tempId = Date.now().toString();
      setProducts([...products, { ...newProduct, id: tempId }]);
    }
  };

  const updateProductStock = async (productId, quantity) => {
    try {
      const productToUpdate = products.find(p => p.id === productId);
      if (productToUpdate) {
        const updatedProduct = { ...productToUpdate, stock: productToUpdate.stock - quantity };
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct)
        });
        if (res.ok) {
          const savedProduct = await res.json();
          setProducts(products.map((p) => p.id === productId ? savedProduct : p));
        } else {
          throw new Error("Backend response not ok");
        }
      }
    } catch (error) {
      console.error("Error updating product stock, falling back to local state:", error);
      setProducts(products.map(p =>
        p.id === productId ? { ...p, stock: p.stock - quantity } : p
      ));
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProductStock }}>
      {children}
    </ProductContext.Provider>
  );
};
