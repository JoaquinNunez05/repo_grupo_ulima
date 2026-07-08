import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Truck, Home, ArrowLeft, Package, Sparkles } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Confirmado');
  const [useSimulation, setUseSimulation] = useState(true);

  // Cargar orden desde localStorage
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('techgear_orders') || '[]');
    const foundOrder = orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      setCurrentStatus(foundOrder.status || 'Confirmado');
    }
  }, [orderId]);

  // Simulación por tiempo si el usuario no la desactiva
  useEffect(() => {
    if (!order || !useSimulation) return;

    const interval = setInterval(() => {
      const elapsed = (new Date().getTime() - new Date(order.date).getTime()) / 1000; // segundos
      
      let nextStatus = 'Confirmado';
      if (elapsed >= 75) {
        nextStatus = 'Entregado';
      } else if (elapsed >= 45) {
        nextStatus = 'En Camino';
      } else if (elapsed >= 15) {
        nextStatus = 'En Preparación';
      }

      if (nextStatus !== currentStatus) {
        setCurrentStatus(nextStatus);
        updateOrderInStorage(nextStatus);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order, currentStatus, useSimulation]);

  const updateOrderInStorage = (newStatus) => {
    const orders = JSON.parse(localStorage.getItem('techgear_orders') || '[]');
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        // Generar historial de estados si no existe
        const updatedHistory = [...(o.history || [])];
        if (!updatedHistory.some(h => h.status === newStatus)) {
          let title = '';
          let desc = '';
          switch (newStatus) {
            case 'En Preparación':
              title = 'En Preparación';
              desc = 'Tu pedido está siendo empaquetado en nuestro almacén.';
              break;
            case 'En Camino':
              title = 'En Camino';
              desc = 'El pedido ha sido entregado al transportista y va en ruta.';
              break;
            case 'Entregado':
              title = 'Entregado';
              desc = 'El pedido ha sido entregado con éxito en la dirección indicada.';
              break;
            default:
              title = 'Confirmado';
              desc = 'Pago procesado y pedido confirmado.';
          }
          updatedHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            title,
            description: desc
          });
        }
        return { ...o, status: newStatus, history: updatedHistory };
      }
      return o;
    });
    localStorage.setItem('techgear_orders', JSON.stringify(updatedOrders));
    
    // Actualizar el estado local de la orden
    const found = updatedOrders.find(o => o.id === orderId);
    if (found) {
      setOrder(found);
    }
  };

  const handleManualStatusChange = (status) => {
    setUseSimulation(false); // Detener auto-simulación si el usuario interactúa manualmente
    setCurrentStatus(status);
    updateOrderInStorage(status);
  };

  if (!order) {
    return (
      <div className="tracking-page container page-container animate-fade-in not-found">
        <div className="not-found-card glass">
          <h2>Pedido no encontrado</h2>
          <p>No pudimos encontrar ningún pedido con el identificador <strong>{orderId}</strong>.</p>
          <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  // Lista de estados para la línea de tiempo
  const statuses = [
    { key: 'Confirmado', label: 'Confirmado', icon: <CheckCircle2 size={24} />, desc: 'Pago aprobado' },
    { key: 'En Preparación', label: 'Preparación', icon: <Package size={24} />, desc: 'Empaquetando productos' },
    { key: 'En Camino', label: 'En Camino', icon: <Truck size={24} />, desc: 'En reparto' },
    { key: 'Entregado', label: 'Entregado', icon: <Home size={24} />, desc: 'Recibido' }
  ];

  // Calcular índice del estado actual
  const currentStepIndex = statuses.findIndex(s => s.key === currentStatus);

  return (
    <div className="tracking-page container page-container animate-fade-in">
      <div className="tracking-back-nav">
        <Link to="/orders" className="back-link">
          <ArrowLeft size={20} /> Mis Pedidos
        </Link>
      </div>

      <div className="tracking-layout">
        {/* LADO IZQUIERDO: SEGUIMIENTO VISUAL */}
        <div className="tracking-main glass">
          <div className="order-meta-header">
            <div>
              <span className="order-tag">Pedido</span>
              <h2>{order.id}</h2>
              <span className="order-date">Realizado el: {new Date(order.date).toLocaleString()}</span>
            </div>
            <div className="status-badge" data-status={currentStatus}>
              {currentStatus}
            </div>
          </div>

          {/* LÍNEA DE TIEMPO INTERACTIVA */}
          <div className="timeline-container">
            <div className="timeline-progress-bar">
              <div 
                className="timeline-progress-fill" 
                style={{ width: `${(currentStepIndex / (statuses.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            <div className="timeline-steps">
              {statuses.map((s, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;
                return (
                  <div key={s.key} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="step-icon-wrapper">
                      {s.icon}
                    </div>
                    <span className="step-title">{s.label}</span>
                    <span className="step-desc">{s.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORIAL DEL PEDIDO */}
          <div className="order-history-section">
            <h3>Detalle del Progreso</h3>
            <div className="history-list">
              {(order.history || []).slice().reverse().map((h, i) => (
                <div key={i} className="history-item">
                  <div className="history-dot"></div>
                  <div className="history-content">
                    <div className="history-header">
                      <h4>{h.title}</h4>
                      <span className="history-time">{new Date(h.date).toLocaleTimeString()}</span>
                    </div>
                    <p>{h.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DERECHO: DETALLES DE COMPRA Y SIMULADOR */}
        <div className="tracking-sidebar">
          {/* SIMULADOR DE ESTADOS (Solo para pruebas) */}
          <div className="simulator-card glass">
            <div className="simulator-title">
              <Sparkles size={18} className="sim-icon" />
              <h3>Simulador de Entrega</h3>
            </div>
            <p>Controla o simula el progreso del despacho para verificar la UI:</p>
            
            <div className="simulator-buttons">
              {statuses.map(s => (
                <button 
                  key={s.key}
                  onClick={() => handleManualStatusChange(s.key)}
                  className={`sim-btn ${currentStatus === s.key ? 'active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="sim-toggle-mode">
              <label>
                <input 
                  type="checkbox" 
                  checked={useSimulation} 
                  onChange={(e) => setUseSimulation(e.target.checked)} 
                />
                Simulación en tiempo real (avanza cada 30s)
              </label>
            </div>
          </div>

          {/* RESUMEN DE PRODUCTOS */}
          <div className="order-summary-card glass">
            <h3>Resumen de Productos</h3>
            <div className="summary-items">
              {order.items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <span>Cant: {item.quantity} x S/ {item.price.toFixed(2)}</span>
                  </div>
                  <span className="item-price">S/ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>S/ {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Envío</span>
                <span className="free">Gratis</span>
              </div>
              <div className="totals-row">
                <span>Impuestos (15%)</span>
                <span>S/ {(order.total - order.subtotal).toFixed(2)}</span>
              </div>
              <div className="totals-row grand-total">
                <span>Total pagado</span>
                <span>S/ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* DETALLES DE ENVÍO */}
          <div className="shipping-info-card glass">
            <h3>Detalles de Envío</h3>
            <div className="info-group">
              <label>Destinatario</label>
              <p>{order.shippingDetails.name || order.shippingDetails.shippingName}</p>
            </div>
            <div className="info-group">
              <label>Dirección</label>
              <p>{order.shippingDetails.address || order.shippingDetails.shippingAddress}</p>
            </div>
            <div className="info-group">
              <label>Ciudad / Distrito</label>
              <p>{order.shippingDetails.city || order.shippingDetails.shippingCity}</p>
            </div>
            <div className="info-group">
              <label>Teléfono de contacto</label>
              <p>{order.shippingDetails.phone || order.shippingDetails.shippingPhone}</p>
            </div>
            <div className="info-group">
              <label>Método de Pago</label>
              <p>Tarjeta Visa/Mastercard ({order.paymentDetails.cardNumber})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
