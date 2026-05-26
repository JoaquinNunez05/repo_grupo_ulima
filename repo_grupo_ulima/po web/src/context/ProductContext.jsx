import { createContext, useState, useEffect } from 'react';
import initialProducts from '../data/initialProducts.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  // Estado donde se guardarán todos los productos
  const [products, setProducts] = useState([]);

  // se ejecuta una sola vez cuando carga la app
  useEffect(() => {
    // Busca productos guardados en localStorage
    const storedProducts = localStorage.getItem('techgear_products');
    // Si existen productos guardados
    if (storedProducts) {
      // lo guarda en el estado
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

  }, []); // ejecutar solo una vez

  // add prods
  const addProduct = (newProduct) => {
    // Si existen productos:
    // obtiene el ID más alto y suma 1
    //
    // Si no existen:
    // empieza desde 1
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
    // Guarda el nuevo arreglo en localStorage
    localStorage.setItem(
      'techgear_products',
      JSON.stringify(updatedProducts)
    );
  };

  // actu stock
  const updateProductStock = (productId, quantity) => {

    // Recorre todos los productos
    const updatedProducts = products.map(p => {
      // Si encuentra el producto correcto
      if (p.id === productId) {
        // Devuelve un nuevo objeto actualizado
        return {
          // Copia todas las propiedades anteriores
          ...p,
          stock: Math.max(0, p.stock - quantity)
        };
      }
      // Si NO coincide el ID
      // devuelve el producto sin cambios
      return p;
    });
    // Actualiza el estado
    setProducts(updatedProducts);
    // Guarda cambios en localStorage
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