import { createContext, useState, useEffect } from 'react';
import initialProducts from '../data/initialProducts.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

 
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    
    const storedProducts = localStorage.getItem('techgear_products');
    // Si existen productos guardados
    if (storedProducts) {
     
      setProducts(JSON.parse(storedProducts));

    } else {
      // Si NO hay productos guardados
      // Usa los productos iniciales
      setProducts(initialProducts);
      localStorage.setItem(
        'techgear_products',
        JSON.stringify(initialProducts)
      );
    }

  }, []); 

  // add prods
  const addProduct = (newProduct) => {

    const newId =
      products.length > 0
        ? Math.max(...products.map(p => p.id)) + 1
        : 1;
    // Crea un nuevo objeto agregando el ID
    const productWithId = {
      ...newProduct,
      id: newId
    };
    // nuevo arr con productos anteriores + nuevo producto
    const updatedProducts = [
      ...products,
      productWithId
    ];
    setProducts(updatedProducts);
  
    localStorage.setItem(
      'techgear_products',
      JSON.stringify(updatedProducts)
    );
  };

  // actu stock
  const updateProductStock = (productId, quantity) => {

   
    const updatedProducts = products.map(p => {
      // Si encuentra el producto correcto
      if (p.id === productId) {
       
        return {
          // Copia todas las propiedades anteriores
          ...p,
          stock: Math.max(0, p.stock - quantity)
        };
      }
      // Si NO coincide el ID devuelve el producto sin cambios
      return p;
    });

    setProducts(updatedProducts);
    
    localStorage.setItem(
      'techgear_products',
      JSON.stringify(updatedProducts)
    );
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