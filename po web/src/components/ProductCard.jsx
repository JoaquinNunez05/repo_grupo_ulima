import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import PropTypes from 'prop-types';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (e) => {
    //evita que el link navegue automaticamente
    e.preventDefault();
    //evita que el clic del boton tambien active el clic del contenedor padre
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card glass animate-fade-in">
      <div className="card-image-container">
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="stock-badge warning">Últimos {product.stock}</span>
        )}
        {product.stock === 0 && (
          <span className="stock-badge danger">Agotado</span>
        )}
      </div>
      {/* muestra la categoria y nombre */}
      <div className="card-content">
        <span className="card-category">{product.category}</span>
        <h3 className="card-title">{product.name}</h3>
        
        <div className="card-footer">
          {/* convierte el numero a 2 decimales. */}
          <span className="card-price">S/ {product.price.toFixed(2)}</span>
          <button 
            className="add-btn" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title={product.stock === 0 ? "Agotado" : "Añadir al carrito"}
            
          >
            {/* si no hay stock entonces dice agotado, si hay lo añade y desactiva el boton */}


            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};
//define la estructura esperada del objeto
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;