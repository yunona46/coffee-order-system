import React from 'react';
import CartItem from '../CartItem/CartItem';
import OrderSummary from '../OrderSummary/OrderSummary';
import './Cart.css';

const Cart = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onCheckout, 
  total, 
  user, 
  isLoading,
  setCurrentView 
}) => {
  if (cartItems.length === 0) {
    return (
      <section className="cart" role="main" aria-labelledby="cart-title">
        <h2 id="cart-title">Кошик</h2>
        <div className="empty-cart" role="status">
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">🛒</div>
            <h3>Кошик порожній</h3>
            <p>Додайте товари з нашого меню</p>
            <button
              className="btn btn-primary"
              onClick={() => setCurrentView('menu')}
              aria-label="Перейти до меню для додавання товарів"
            >
              <i className="fas fa-utensils" aria-hidden="true"></i> Перейти до меню
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart" role="main" aria-labelledby="cart-title">
      <h2 id="cart-title">Кошик</h2>
      
      <div className="cart-content">
        <div className="cart-items" role="list" aria-label="Товари в кошику">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveFromCart}
            />
          ))}
        </div>

        <OrderSummary
          total={total}
          user={user}
          onCheckout={onCheckout}
          isLoading={isLoading}
          itemsCount={cartItems.length}
        />
      </div>
    </section>
  );
};

export default Cart;