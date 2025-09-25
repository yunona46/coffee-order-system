import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [pickupTime, setPickupTime] = useState('asap');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrder = async () => {
    if (items.length === 0 || !user) return;
    
    setIsOrdering(true);
    
    setTimeout(() => {
      setIsOrdering(false);
      setOrderSuccess(true);
      clearCart();
      
      setTimeout(() => {
        setOrderSuccess(false);
      }, 3000);
    }, 1500);
  };

  const generatePickupTimes = () => {
    const times = [];
    const now = new Date();
    
    for (let i = 1; i <= 8; i++) {
      const time = new Date(now.getTime() + i * 15 * 60000);
      const timeString = time.toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      times.push(timeString);
    }
    
    return times;
  };

  if (orderSuccess) {
    return (
      <div className="order-success">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Замовлення оформлено!</h2>
          <p>Ваше замовлення буде готове до обраного часу</p>
          <button className="btn btn-primary" onClick={() => setOrderSuccess(false)}>
            Повернутись до меню
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-cart">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Необхідна авторизація</h2>
          <p>Увійдіть в систему для оформлення замовлення</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Кошик порожній</h2>
          <p>Додайте товари з меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Ваше замовлення</h2>
      
      <div className="cart-items">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="cart-item">
            <div className="item-info">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="item-image-img" />
                ) : (
                  <span className="item-emoji">☕</span>
                )}
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                {item.syrup && (
                  <p className="item-syrup">Сироп: {item.syrup} (+10 ₴)</p>
                )}
                <p className="item-price">{item.price} ₴</p>
              </div>
            </div>
            
            <div className="quantity-controls">
              <button 
                className="btn btn-sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={isOrdering}
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button 
                className="btn btn-sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={isOrdering}
              >
                +
              </button>
            </div>
            
            <div className="item-total">{item.price * item.quantity} ₴</div>
            
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => removeItem(item.id)}
              disabled={isOrdering}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="checkout-section">
        <div className="pickup-time">
          <label>Час забирання:</label>
          <select 
            value={pickupTime} 
            onChange={(e) => setPickupTime(e.target.value)}
            disabled={isOrdering}
          >
            <option value="asap">Якомога швидше</option>
            {generatePickupTimes().map((time, idx) => (
              <option key={idx} value={time}>О {time}</option>
            ))}
          </select>
        </div>
        
        <div className="total-section">
          <h3>Разом: {total} ₴</h3>
          <button 
            className="btn btn-primary btn-large"
            onClick={handleOrder}
            disabled={isOrdering}
          >
            {isOrdering ? (
              <>
                <div className="spinner-circle-small"></div>
                Обробка...
              </>
            ) : (
              <>
                <i className="fas fa-credit-card"></i>
                Оформити замовлення
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
