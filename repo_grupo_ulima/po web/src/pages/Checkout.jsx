import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import './Checkout.css';

const Checkout = () => {
  const {
    cartItems,
    cartSubtotal,
    cartTotal,
    clearCart
  } = useContext(CartContext);
  
  const { currentUser } = useContext(AuthContext);
  const { updateProductStock } = useContext(ProductContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Datos de Envío, 2: Datos de Pago
  
  const [shippingData, setShippingData] = useState({
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPhone: ''
  });

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    phone: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Proteger la ruta si no hay usuario o si el carrito está vacío
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [currentUser, cartItems, isSuccess, navigate]);

  useEffect(() => {
    if (currentUser && !shippingData.shippingName) {
      setShippingData(prev => ({
        ...prev,
        shippingName: currentUser.name || ''
      }));
    }
  }, [currentUser]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData({
      ...shippingData,
      [name]: value
    });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // FORMATO TARJETA
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
      if (value.length > 19) return;
    }
    
    // FORMATO FECHA
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
      }
      if (value.length > 5) return;
    }

    // FORMATO CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }

    // FORMATO TELEFONO
    if (name === 'phone') {
      value = value.replace(/\D/g, '');
      if (value.length > 9) return;
    }

    // Actualiza formulario
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Validar campos de envío
    if (!shippingData.shippingName.trim() || 
        !shippingData.shippingAddress.trim() || 
        !shippingData.shippingCity.trim() || 
        !shippingData.shippingPhone.trim()) {
      alert('Por favor, completa todos los campos de envío.');
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  // Enviar pago
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos de tarjeta
    if (!formData.cardName.trim() || 
        formData.cardNumber.replace(/\s/g, '').length !== 16 || 
        formData.expiry.length !== 5 || 
        formData.cvv.length !== 3) {
      alert('Por favor, completa los datos de tu tarjeta correctamente.');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      // 1. Reducir stock
      cartItems.forEach(item => {
        updateProductStock(item.id, item.quantity);
      });

      // 2. Generar el pedido
      const orderId = `TG-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        id: orderId,
        userId: currentUser.id,
        userEmail: currentUser.email,
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: cartSubtotal,
        total: cartTotal,
        shippingDetails: {
          name: shippingData.shippingName,
          address: shippingData.shippingAddress,
          city: shippingData.shippingCity,
          phone: shippingData.shippingPhone
        },
        paymentDetails: {
          cardName: formData.cardName,
          cardNumber: `•••• •••• •••• ${formData.cardNumber.slice(-4)}`
        },
        status: 'Confirmado',
        history: [
          {
            status: 'Confirmado',
            date: new Date().toISOString(),
            title: 'Pedido Confirmado',
            description: 'Hemos recibido tu pedido y el pago ha sido procesado de forma segura.'
          }
        ]
      };

      // 3. Guardar en localStorage
      const existingOrders = JSON.parse(localStorage.getItem('techgear_orders') || '[]');
      localStorage.setItem('techgear_orders', JSON.stringify([...existingOrders, newOrder]));

      setCreatedOrderId(orderId);
      setIsProcessing(false);
      setIsSuccess(true);
      
      // 4. Vaciar carrito
      clearCart();

      // Redirecciona al seguimiento de pedido después de 3 segundos
      setTimeout(() => {
        navigate(`/order-tracking/${orderId}`);
      }, 3000);

    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="checkout-page container page-container animate-fade-in success-state">
        <div className="success-card glass">
          <CheckCircle size={80} className="success-icon" />
          <h2>¡Pago Exitoso!</h2>
          <p>Tu orden <strong>{createdOrderId}</strong> ha sido procesada correctamente.</p>
          <p className="redirect-msg">Redirigiendo al seguimiento de tu pedido en unos segundos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container page-container animate-fade-in">
      <div className="checkout-container glass">
        {/* Indicador de pasos */}
        <div className="checkout-steps">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Envío</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Pago</span>
          </div>
        </div>

        <div className="checkout-header">
          {step === 1 ? (
            <>
              <MapPin size={32} className="checkout-icon" />
              <h2>Datos de Envío</h2>
            </>
          ) : (
            <>
              <CreditCard size={32} className="checkout-icon" />
              <h2>Completar Pago</h2>
            </>
          )}
        </div>

        <div className="payment-summary">
          <span>Total a Pagar:</span>
          <span className="total-amount">S/ {cartTotal.toFixed(2)}</span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="checkout-form">
            <div className="form-group">
              <label>Nombre del Destinatario</label>
              <input 
                type="text" 
                name="shippingName" 
                value={shippingData.shippingName} 
                onChange={handleShippingChange} 
                placeholder="Juan Pérez"
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Dirección de Envío</label>
              <input 
                type="text" 
                name="shippingAddress" 
                value={shippingData.shippingAddress} 
                onChange={handleShippingChange} 
                placeholder="Av. Javier Prado Este 4600"
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ciudad / Distrito</label>
                <input 
                  type="text" 
                  name="shippingCity" 
                  value={shippingData.shippingCity} 
                  onChange={handleShippingChange} 
                  placeholder="Santiago de Surco"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  name="shippingPhone" 
                  value={shippingData.shippingPhone} 
                  onChange={handleShippingChange} 
                  placeholder="999888777"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="pay-btn">
              Continuar al Pago <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </form>
        ) : (
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

            <div className="form-actions">
              <button type="button" onClick={handlePrevStep} className="back-btn" disabled={isProcessing}>
                <ArrowLeft size={20} /> Volver
              </button>
              
              <button 
                type="submit" 
                className={`pay-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
                style={{ marginTop: 0, flex: 1 }}
              >
                {isProcessing ? 'Procesando Pago...' : `Pagar S/ ${cartTotal.toFixed(2)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;