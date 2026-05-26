import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

// Componente detalle producto
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Productos del contexto
  const { products } = useContext(ProductContext);
  // Función agregar carrito
  const { addToCart } = useContext(CartContext);
  // Estado producto actual
  const [product, setProduct] = useState(null);
  // Cantidad seleccionada
  const [quantity, setQuantity] = useState(1);

  // Busca producto al cargar
  useEffect(() => {
    // Busca producto por ID
    const foundProduct = products.find(
      (p) => p.id === id
    );
    // Si encuentra producto
    if (foundProduct) {
      // Guarda producto
      setProduct(foundProduct);
    }
  }, [id, products]);
  // Mientras carga producto
  if (!product)
    return (
      <div className="page-container container">
        <p>Cargando producto...</p>
      </div>
    );
  // Agregar producto al carrito
  const handleAddToCart = () => {
    // Agrega producto y cantidad
    addToCart(product, quantity);
    // Redirecciona al carrito
    navigate('/cart');
  };

  return (
    <div className="product-detail-page container page-container animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Volver al catálogo
      </button>

      <div className="detail-grid">
        <div className="detail-image-container glass">
          <img src={product.image} alt={product.name} className="detail-image" />
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-price">S/ {product.price.toFixed(2)}</p>
          
          <p className="detail-description">{product.description}</p>
          
          <div className="stock-info">
            <span className={`status-dot ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}></span>
            {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado temporalmente'}
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1 || product.stock === 0}
              >-</button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock || product.stock === 0}
              >+</button>
            </div>
            
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              Añadir al carrito
            </button>
          </div>

          <div className="benefits">
            <div className="benefit-item">
              <ShieldCheck size={24} className="benefit-icon" />
              <div>
                <h4>Garantía Premium</h4>
                <p>2 años de cobertura total</p>
              </div>
            </div>
            <div className="benefit-item">
              <Truck size={24} className="benefit-icon" />
              <div>
                <h4>Envío Express</h4>
                <p>Gratis a todo el país</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;