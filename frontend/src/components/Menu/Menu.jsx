import React, { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import SearchAndFilter from '../SearchAndFilter/SearchAndFilter';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import './Menu.css';

const Menu = ({ products, onAddToCart, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Фільтрація та сортування продуктів
  const filteredProducts = (currentCategory === 'all'
    ? products
    : products.filter(product => product.category === currentCategory)
  )
  .filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case 'price': 
        return a.price - b.price;
      case 'price-desc': 
        return b.price - a.price;
      case 'name': 
        return a.name.localeCompare(b.name, 'uk');
      case 'category':
        return a.category.localeCompare(b.category);
      default: 
        return 0;
    }
  });

  return (
    <section className="menu" role="main" aria-labelledby="menu-title">
      <h2 id="menu-title">Наше Меню</h2>

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <CategoryFilter
        categories={categories}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />

      {filteredProducts.length === 0 ? (
        <div className="empty-state" role="status" aria-live="polite">
          <div className="empty-icon" aria-hidden="true">🔍</div>
          <h3>Товари не знайдено</h3>
          <p>Спробуйте змінити пошуковий запит або категорію</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setCurrentCategory('all');
            }}
          >
            Очистити фільтри
          </button>
        </div>
      ) : (
        <div 
          className="products-grid" 
          role="grid" 
          aria-label={`${filteredProducts.length} товарів знайдено`}
        >
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Menu;