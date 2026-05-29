import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartTotal
  } = useContext(CartContext);
  
  const { currentUser } = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    // Si no hay usuario logueado
    if (!currentUser) {
      // Redirecciona al login
      navigate('/auth');
    } else {
      // Va a checkout
      navigate('/checkout');
    }
  };
  // Si el carrito está vacío
  if (cartItems.length === 0) {
    return (

      // Vista carrito vacío
      <div className="cart-page container page-container empty-cart animate-fade-in">
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has añadido periféricos a tu carrito.</p>
        {/* Botón volver catálogo */}
        <Link
          to="/"
          className="btn-primary">Explorar Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container page-container animate-fade-in">
      <h1 className="cart-title">Tu Carrito</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item glass">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>
                  <h3>{item.name}</h3>
                </Link>
                <span className="cart-item-price">S/ {item.price.toFixed(2)}</span>
              </div>
              
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary glass">
          <h2>Resumen de Compra</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>S/ {cartSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Envío</span>
            <span className="free">Gratis</span>
          </div>
          
          <div className="summary-row">
            <span>Impuestos (15%)</span>
            <span>S/ {(cartTotal - cartSubtotal).toFixed(2)}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>S/ {cartTotal.toFixed(2)}</span>
          </div>
          
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceder al Pago <ArrowRight size={20} />
          </button>
          
          {!currentUser && (
            <p className="auth-warning">Te pediremos iniciar sesión en el siguiente paso.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
