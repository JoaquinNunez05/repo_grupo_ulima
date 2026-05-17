import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import './Admin.css';

const Admin = () => {
  const { currentUser } = useContext(AuthContext);
  const { products, addProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Teclados',
    price: '',
    stock: '',
    image: '',
    description: ''
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Protección de ruta manual (ya que lo controlamos via state en App.jsx)
    if (!currentUser || !currentUser.isAdmin) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !currentUser.isAdmin) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    };
    
    // Asignar placeholder por defecto si no se pone imagen
    if (!newProduct.image) {
      if(newProduct.category === 'Teclados') newProduct.image = 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80';
      else if(newProduct.category === 'Mouses') newProduct.image = 'https://images.unsplash.com/photo-1615663245857-ac1eeb536fcb?w=800&q=80';
      else newProduct.image = 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80';
    }

    addProduct(newProduct);
    setSuccess(true);
    setFormData({
      name: '',
      category: 'Teclados',
      price: '',
      stock: '',
      image: '',
      description: ''
    });
  };

  return (
    <div className="admin-page container page-container animate-fade-in">
      <div className="admin-header">
        <LayoutDashboard size={32} className="admin-icon" />
        <h1>Dashboard Administrador</h1>
      </div>
      
      <div className="admin-grid">
        <div className="admin-card glass">
          <h2><PackagePlus size={24} /> Ingresar Nuevo Producto</h2>
          
          {success && <div className="success-message">Producto añadido exitosamente.</div>}
          
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Nombre del Producto</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Teclados">Teclados</option>
                  <option value="Mouses">Mouses</option>
                  <option value="Headsets">Headsets</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Precio (S/)</label>
                <input 
                  type="number" 
                  name="price" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Stock (Unidades)</label>
                <input 
                  type="number" 
                  name="stock" 
                  min="0" 
                  value={formData.stock} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de Imagen (Opcional)</label>
              <input 
                type="url" 
                name="image" 
                value={formData.image} 
                onChange={handleChange} 
                placeholder="https://ejemplo.com/imagen.jpg" 
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="3"
                required 
              ></textarea>
            </div>

            <button type="submit" className="admin-submit-btn">Guardar Producto</button>
          </form>
        </div>

        <div className="admin-stats glass">
          <h2>Estadísticas de Inventario</h2>
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Valor Total del Inventario</h3>
            <p className="stat-number">
              S/ {products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Productos Sin Stock</h3>
            <p className="stat-number warning">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
