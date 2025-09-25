import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => setCurrentView('menu')}>
          <i className="fas fa-coffee"></i>
          <h1>Coffee Shop</h1>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-link ${currentView === 'menu' ? 'active' : ''}`}
            onClick={() => setCurrentView('menu')}
          >
            <i className="fas fa-utensils"></i> ����
          </button>
          
          <button 
            className={`nav-link ${currentView === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentView('cart')}
          >
            <i className="fas fa-shopping-cart"></i> �����
            {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </button>
          
          {user ? (
            <>
              <button 
                className={`nav-link ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentView('orders')}
              >
                <i className="fas fa-history"></i> �� ����������
              </button>
              <div className="user-menu">
                <span>³����, {user.name}!</span>
                <button className="nav-link" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i> �����
                </button>
              </div>
            </>
          ) : (
            <button 
              className={`nav-link ${currentView === 'auth' ? 'active' : ''}`}
              onClick={() => setCurrentView('auth')}
            >
              <i className="fas fa-user"></i> �����
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

