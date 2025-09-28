import React from 'react';
import './Header.css';

const Header = ({ currentView, setCurrentView, cartItemsCount, user, isDarkTheme, setIsDarkTheme, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => setCurrentView('menu')}>
          <span className="coffee-icon">☕</span>
          <h1>CoffeeShop</h1>
        </div>
        <nav className="nav">
          <button
            className={`nav-link ${currentView === 'menu' ? 'active' : ''}`}
            onClick={() => setCurrentView('menu')}
          >
            <i className="fas fa-utensils"></i> Меню
          </button>
          <button
            className={`nav-link cart-btn ${currentView === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentView('cart')}
          >
            <i className="fas fa-shopping-cart"></i> Кошик
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </button>
          <button
            className={`nav-link ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentView('orders')}
          >
            <i className="fas fa-history"></i> Замовлення
          </button>
          
          <div className="user-menu">
            {user ? (
              <button className="nav-link" onClick={onLogout}>
                <i className="fas fa-user"></i> {user.name}
              </button>
            ) : (
              <button
                className="nav-link"
                onClick={() => setCurrentView('auth')}
              >
                <i className="fas fa-sign-in-alt"></i> Увійти
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
