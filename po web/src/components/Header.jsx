import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { currentUser, logout } = useContext(AuthContext);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header glass">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-accent">Tech</span>Gear
        </Link>
        
        <nav className="nav-links">
          {currentUser?.isAdmin && (
            <Link to="/admin" className="nav-link">Dashboard</Link>
          )}
          
          <div className="user-section">
            {currentUser ? (
              <div className="user-info">
                <span className="user-name">Hola, {currentUser.name.split(' ')[0]}</span>
                <button onClick={logout} className="icon-btn" title="Cerrar Sesión">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="icon-btn" title="Iniciar Sesión">
                <User size={24} />
              </Link>
            )}
          </div>

          <Link to="/cart" className="cart-widget">
            <ShoppingCart size={24} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
