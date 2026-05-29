import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import './Checkout.css';

const Checkout = () => {
  
  const {
    cartItems,
    cartTotal,
    clearCart

  } = useContext(CartContext);
  
  const { currentUser } = useContext(AuthContext);
  
  const { updateProductStock } = useContext(ProductContext);
  
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  
  const [isProcessing, setIsProcessing] = useState(false);
 
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleChange = (e) => {
    // Obtiene nombre y valor input
    let { name, value } = e.target;

    // FORMATO TARJETA
    if (name === 'cardNumber') {
      // Elimina letras y símbolos
      value = value.replace(/\D/g, '')
        // Agrega espacio cada 4 números
        .replace(/(.{4})/g, '$1 ')
        
        .trim();
      
      if (value.length > 19) return;
    }
    // FORMATO FECHA
    if (name === 'expiry') {
      // Solo números
      value = value.replace(/\D/g, '');
      
      if (value.length >= 2) {
        value =
          `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
      
      if (value.length > 5) return;
    }

    // FORMATO CVV
    if (name === 'cvv') {
      // Solo números
      value = value.replace(/\D/g, '');
      
      if (value.length > 3) return;
    }
    
    setFormData({
      
      ...formData,
      
      [name]: value
    });
  };
  // Enviar pago
  const handleSubmit = async (e) => {
    // Evita recargar página
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      
      cartItems.forEach(item => {
        // Reduce stock
        updateProductStock(
          item.id,
          item.quantity
        );
      });
      // Desactiva loading
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      // Redirecciona al inicio
      setTimeout(() => {
        navigate('/');
      }, 3000);

    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="checkout-page container page-container animate-fade-in success-state">
        <div className="success-card glass">
          <CheckCircle size={80} className="success-icon" />
          <h2>¡Pago Exitoso!</h2>
          <p>Tu orden ha sido procesada correctamente.</p>
          <p className="redirect-msg">Redirigiendo al catálogo en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container page-container animate-fade-in">
      <div className="checkout-container glass">
        <div className="checkout-header">
          <CreditCard size={32} className="checkout-icon" />
          <h2>Completar Pago</h2>
        </div>
        
        <div className="payment-summary">
          <span>Total a Pagar:</span>
          <span className="total-amount">S/ {cartTotal.toFixed(2)}</span>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label>Nombre en la Tarjeta</label>
            <input 
              type="text" 
              name="cardName" 
              value={formData.cardName} 
              onChange={handleChange} 
              placeholder="JUAN PEREZ"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Número de Tarjeta</label>
            <input 
              type="text" 
              name="cardNumber" 
              value={formData.cardNumber} 
              onChange={handleChange} 
              placeholder="0000 0000 0000 0000"
              maxLength="19"
              required 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Vencimiento (MM/AA)</label>
              <input 
                type="text" 
                name="expiry" 
                value={formData.expiry} 
                onChange={handleChange} 
                placeholder="12/25"
                maxLength="5"
                required 
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input 
                type="password" 
                name="cvv" 
                value={formData.cvv} 
                onChange={handleChange} 
                placeholder="123"
                maxLength="3"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`pay-btn ${isProcessing ? 'processing' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando Pago...' : `Pagar S/ ${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
