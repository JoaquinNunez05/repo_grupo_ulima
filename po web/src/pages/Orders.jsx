import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    
    // Cargar órdenes de localStorage
    const allOrders = JSON.parse(localStorage.getItem('techgear_orders') || '[]');
    // Filtrar por el usuario actual
    const userOrders = allOrders.filter(order => order.userId === currentUser.id);
    
    // Ordenar por fecha más reciente
    userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setOrders(userOrders);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="orders-page container page-container animate-fade-in not-logged-in">
        <div className="empty-orders-card glass">
          <h2>Inicia sesión para ver tus pedidos</h2>
          <p>Debes iniciar sesión con tu cuenta para visualizar tu historial de compras.</p>
          <Link to="/auth" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page container page-container animate-fade-in empty-state">
        <div className="empty-orders-card glass">
          <ShoppingBag size={64} className="empty-icon" />
          <h2>Aún no tienes pedidos</h2>
          <p>Cuando realices compras de periféricos TechGear, aparecerán en esta sección con su estado de despacho en tiempo real.</p>
          <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container page-container animate-fade-in">
      <div className="orders-header">
        <ShoppingBag size={32} className="orders-icon" />
        <h1>Mis Pedidos</h1>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card glass">
            {/* Cabecera de la tarjeta */}
            <div className="order-card-header">
              <div className="header-info">
                <span className="order-id-label">Pedido:</span>
                <span className="order-id-value">{order.id}</span>
              </div>
              <div className="order-status-badge" data-status={order.status || 'Confirmado'}>
                {order.status || 'Confirmado'}
              </div>
            </div>

            {/* Contenido principal */}
            <div className="order-card-body">
              <div className="order-details-grid">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{new Date(order.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="detail-item">
                  <ShieldCheck size={16} />
                  <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'producto' : 'productos'}</span>
                </div>
              </div>

              {/* Lista de miniaturas */}
              <div className="order-items-thumbnails">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-thumbnail-wrapper" title={item.name}>
                    <img src={item.image} alt={item.name} className="item-thumbnail" />
                    {item.quantity > 1 && <span className="thumbnail-qty">x{item.quantity}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Pie de la tarjeta */}
            <div className="order-card-footer">
              <div className="order-total-section">
                <span className="total-label">Total:</span>
                <span className="total-value">S/ {order.total.toFixed(2)}</span>
              </div>
              
              <Link to={`/order-tracking/${order.id}`} className="track-order-btn">
                Seguir Pedido <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
