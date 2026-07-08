import { useContext, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {

  const { products } = useContext(ProductContext);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Teclados',
    'Mouses',
    'Headsets'
  ];
  // Filtra productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Busca coincidencia por nombre
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        
        selectedCategory === 'All'
       
        || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  },
  // Recalcula si cambian estos valores
  [products, searchTerm, selectedCategory]);

  return (
    <div className="home-page container page-container animate-fade-in">
      <div className="hero-section">
        <h1 className="hero-title">Eleva tu <span className="highlight">Juego</span></h1>
        <p className="hero-subtitle">Periféricos premium para un rendimiento excelente</p>
      </div>

      <div className="filters-section glass">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
