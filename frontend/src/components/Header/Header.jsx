import React from 'react';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header = ({ currentView, setCurrentView, user, setUser }) => {
  const { itemsCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => setCurrentView('menu')}>
          <i className="fas fa-coffee coffee-icon"></i>
          <h1>Coffee Shop</h1>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-link ${currentView === 'menu' ? 'active' : ''}`}
            onClick={() => setCurrentView('menu')}
          >
            <i className="fas fa-utensils"></i> Меню
          </button>
          
          <button 
            className={`nav-link ${currentView === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentView('cart')}
          >
            <i className="fas fa-shopping-cart"></i> Кошик
            {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </button>
          
          {user ? (
            <>
              <button 
                className={`nav-link ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('orders')}
              >
                <i className="fas fa-history"></i> Мої замовлення
              </button>
              <button 
                className="nav-link"
                onClick={() => setUser(null)}
              >
                <i className="fas fa-sign-out-alt"></i> Вийти
              </button>
            </>
          ) : (
            <button 
              className={`nav-link ${currentView === 'auth' ? 'active' : ''}`}
              onClick={() => setCurrentView('auth')}
            >
              <i className="fas fa-user"></i> Увійти
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
