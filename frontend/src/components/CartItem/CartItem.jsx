import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      if (window.confirm(`Видалити "${item.name}" з кошика?`)) {
        onRemove(item.id);
      }
      return;
    }
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className="cart-item" role="listitem">
      <div className="item-info">
        <div className="item-image">
          <img 
            src={item.image} 
            alt={item.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
        </div>
        <div className="item-details">
          <h4 className="item-name">{item.name}</h4>
          <p className="item-description">{item.description}</p>
          <div className="item-price" aria-label={`Ціна за одиницю: ${item.price} гривень`}>
            {item.price} ₴
          </div>
        </div>
      </div>

      <div className="quantity-controls" role="group" aria-label="Керування кількістю">
        <button
          className="btn btn-outline btn-sm quantity-btn"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          aria-label="Зменшити кількість"
          disabled={item.quantity <= 1}
        >
          <i className="fas fa-minus" aria-hidden="true"></i>
        </button>
        
        <input
          type="number"
          className="quantity-input"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          max="99"
          aria-label={`Кількість ${item.name}`}
        />
        
        <button
          className="btn btn-outline btn-sm quantity-btn"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Збільшити кількість"
          disabled={item.quantity >= 99}
        >
          <i className="fas fa-plus" aria-hidden="true"></i>
        </button>
      </div>

      <div className="item-total" aria-label={`Загальна вартість: ${item.price * item.quantity} гривень`}>
        {item.price * item.quantity} ₴
      </div>

      <button
        className="btn btn-danger btn-sm remove-btn"
        onClick={() => {
          if (window.confirm(`Видалити "${item.name}" з кошика?`)) {
            onRemove(item.id);
          }
        }}
        aria-label={`Видалити ${item.name} з кошика`}
        title="Видалити товар"
      >
        <i className="fas fa-trash" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default CartItem;