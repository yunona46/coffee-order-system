import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onAddWithSyrup }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleAddClick = () => {
    if (product.canAddSyrup) {
      onAddWithSyrup(product);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div className={`product-card ${product.popular ? 'popular' : ''}`}>
      <div className="product-image">
        {!imageLoaded && !imageError && (
          <div className="image-placeholder">
            <i className="fas fa-coffee"></i>
          </div>
        )}
        {imageError ? (
          <div className="image-fallback">
            <span className="product-emoji">☕</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`product-image-img ${imageLoaded ? 'loaded' : ''}`}
          />
        )}
        {product.popular && (
          <div className="popular-badge">⭐ Популярний</div>
        )}
        {product.canAddSyrup && (
          <div className="syrup-badge">🍯 Сироп</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <span className="product-price">{product.price} ₴</span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={handleAddClick}
          >
            <i className="fas fa-plus"></i>
            {product.canAddSyrup ? 'Обрати сироп' : 'Додати'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
