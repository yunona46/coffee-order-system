import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import ProductCard from './ProductCard';
import './Menu.css';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [showSyrupModal, setShowSyrupModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSyrup, setSelectedSyrup] = useState(null);

  const { addItem } = useCart();

  const categories = [
    { id: 'all', name: 'Все', icon: '🍽️' },
    { id: 'coffee', name: 'Кава', icon: '☕' },
    { id: 'tea', name: 'Чай', icon: '🍵' },
    { id: 'dessert', name: 'Десерти', icon: '🍰' },
    { id: 'special', name: 'Спеціальні', icon: '⭐' }
  ];

  const syrups = [
    { id: 'vanilla', name: 'Ванільний', price: 10, emoji: '🍦' },
    { id: 'caramel', name: 'Карамельний', price: 10, emoji: '🍯' },
    { id: 'hazelnut', name: 'Горіховий', price: 10, emoji: '🌰' },
    { id: 'chocolate', name: 'Шоколадний', price: 10, emoji: '🍫' },
    { id: 'coconut', name: 'Кокосовий', price: 10, emoji: '🥥' }
  ];

  useEffect(() => {
    const mockProducts = [
      {
        id: 1, name: "Еспресо", price: 45, category: "coffee", 
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
        description: "Класичний міцний еспресо з насиченим смаком", 
        popular: true, canAddSyrup: true
      },
      {
        id: 2, name: "Капучино", price: 65, category: "coffee", 
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        description: "Ідеальний баланс еспресо та молочної піни", 
        popular: true, canAddSyrup: true
      },
      {
        id: 3, name: "Лате", price: 70, category: "coffee", 
        image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=300&fit=crop",
        description: "Ніжний лате з молоком та латте-артом", 
        popular: false, canAddSyrup: true
      },
      {
        id: 4, name: "Американо", price: 50, category: "coffee", 
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
        description: "Еспресо з гармонійним додаванням води", 
        popular: false, canAddSyrup: true
      },
      {
        id: 5, name: "Тірамісу", price: 85, category: "dessert", 
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
        description: "Класичний італійський десерт з маскарпоне", 
        popular: true, canAddSyrup: false
      },
      {
        id: 6, name: "Круасан", price: 55, category: "dessert", 
        image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=400&h=300&fit=crop",
        description: "Свіжий круасан з вершковим маслом", 
        popular: false, canAddSyrup: false
      },
      {
        id: 7, name: "Чай чорний", price: 40, category: "tea", 
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
        description: "Ароматний чорний чай з цейлонських плантацій", 
        popular: false, canAddSyrup: false
      },
      {
        id: 8, name: "Матча лате", price: 80, category: "special", 
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop",
        description: "Японський зелений чай матча з молоком", 
        popular: true, canAddSyrup: true
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [activeCategory, searchTerm, sortBy, products]);

  const handleAddToCart = (product, syrup = null) => {
    addItem(product, syrup);
  };

  const openSyrupModal = (product) => {
    setSelectedProduct(product);
    setSelectedSyrup(null);
    setShowSyrupModal(true);
  };

  const handleAddWithSyrup = () => {
    if (selectedProduct) {
      const syrup = selectedSyrup ? syrups.find(s => s.id === selectedSyrup) : null;
      handleAddToCart(selectedProduct, syrup);
      setShowSyrupModal(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
        <p>Завантаження меню...</p>
      </div>
    );
  }

  return (
    <div className="menu">
      <h2>Наше меню</h2>
      
      <div className="menu-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Пошук напоїв або десертів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="name">За назвою</option>
            <option value="popular">Популярні</option>
            <option value="price-low">Від дешевих</option>
            <option value="price-high">Від дорогих</option>
          </select>
        </div>
      </div>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>Нічого не знайдено</h3>
          <p>Спробуйте змінити запит або категорію</p>
        </div>
      ) : (
        <>
          <div className="results-info">
            Знайдено {filteredProducts.length} товарів
          </div>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onAddWithSyrup={openSyrupModal}
              />
            ))}
          </div>
        </>
      )}

      {showSyrupModal && (
        <div className="modal-overlay">
          <div className="syrup-modal">
            <div className="modal-header">
              <h3>Оберіть сироп для {selectedProduct?.name}</h3>
              <button className="close-btn" onClick={() => setShowSyrupModal(false)}>×</button>
            </div>
            
            <div className="syrups-list">
              <label className="syrup-option">
                <input
                  type="radio"
                  name="syrup"
                  value=""
                  checked={!selectedSyrup}
                  onChange={() => setSelectedSyrup(null)}
                />
                <span className="syrup-label">
                  <span className="syrup-emoji">🚫</span>
                  Без сиропу
                  <span className="syrup-price">+0 ₴</span>
                </span>
              </label>
              
              {syrups.map(syrup => (
                <label key={syrup.id} className="syrup-option">
                  <input
                    type="radio"
                    name="syrup"
                    value={syrup.id}
                    checked={selectedSyrup === syrup.id}
                    onChange={(e) => setSelectedSyrup(e.target.value)}
                  />
                  <span className="syrup-label">
                    <span className="syrup-emoji">{syrup.emoji}</span>
                    {syrup.name}
                    <span className="syrup-price">+{syrup.price} ₴</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowSyrupModal(false)}>
                Скасувати
              </button>
              <button className="btn btn-primary" onClick={handleAddWithSyrup}>
                Додати за {selectedProduct?.price + (selectedSyrup ? 10 : 0)} ₴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
