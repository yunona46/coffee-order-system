import React, { useState, useEffect } from 'react';
import './App.css';

const mockProducts = [
  { id: 1, name: 'Капучино', description: 'Ароматна кава з молочною піною', price: 65, category: 'coffee', emoji: '☕' },
  { id: 2, name: 'Лате', description: 'Ніжна кава з великою кількістю молока', price: 70, category: 'coffee', emoji: '🥛' },
  { id: 3, name: 'Еспресо', description: 'Класичний міцний еспресо', price: 50, category: 'coffee', emoji: '⚫' },
  { id: 4, name: 'Тірамісу', description: 'Італійський десерт з маскарпоне', price: 85, category: 'dessert', emoji: '🍰' }
];

const App = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('coffeeShopCart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    const savedUser = localStorage.getItem('coffeeShopUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('coffeeShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleLogin = () => {
    setUser({ id: 1, name: 'Демо Користувач', email: 'demo@example.com' });
    setCurrentView('menu');
  };

  const handleCheckout = () => {
    if (!user) {
      setCurrentView('auth');
      return;
    }
    if (cartItems.length === 0) return;
    
    alert('Замовлення успішно оформлено!');
    setCartItems([]);
    setCurrentView('menu');
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo" onClick={() => setCurrentView('menu')}>
            <span className="coffee-icon">☕</span>
            <h1>CoffeeShop</h1>
          </div>
          <nav className="nav">
            <button className={`nav-link ${currentView === 'menu' ? 'active' : ''}`} onClick={() => setCurrentView('menu')}>
              <i className="fas fa-utensils"></i> Меню
            </button>
            <button className={`nav-link cart-btn ${currentView === 'cart' ? 'active' : ''}`} onClick={() => setCurrentView('cart')}>
              <i className="fas fa-shopping-cart"></i> Кошик
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </button>
            <button className={`nav-link ${currentView === 'auth' ? 'active' : ''}`} onClick={() => setCurrentView('auth')}>
              <i className="fas fa-user"></i> {user ? user.name : 'Увійти'}
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {currentView === 'menu' && (
            <section className="menu">
              <h2>Наше Меню</h2>
              <div className="products-grid">
                {mockProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <span className="product-emoji">{product.emoji}</span>
                    </div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-description">{product.description}</div>
                      <div className="product-footer">
                        <div className="product-price">{product.price} ₴</div>
                        <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
                          <i className="fas fa-plus"></i> Додати
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentView === 'cart' && (
            <section className="cart">
              <h2>Кошик</h2>
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-state">
                    <div className="empty-icon">🛒</div>
                    <h2>Кошик порожній</h2>
                    <p>Додайте товари з меню</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <span className="item-emoji">{item.emoji}</span>
                          <div>
                            <h4>{item.name}</h4>
                            <div className="item-price">{item.price} ₴</div>
                          </div>
                        </div>
                        <div className="quantity-controls">
                          <button className="btn btn-outline btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button className="btn btn-outline btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <div className="item-total">{item.price * item.quantity} ₴</div>
                        <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-section">
                    <div className="total-section">
                      <h3>Загальна сума: {total} ₴</h3>
                      <button className="btn btn-primary btn-large" onClick={handleCheckout} disabled={!user}>
                        <i className="fas fa-credit-card"></i> Оформити замовлення
                      </button>
                      {!user && <p style={{color: 'var(--warning-color)', marginTop: '10px'}}>Увійдіть для оформлення</p>}
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {currentView === 'auth' && (
            <section className="auth">
              <div className="auth-form">
                <h2>{user ? 'Профіль' : 'Вхід'}</h2>
                {user ? (
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '4em', marginBottom: '20px'}}>👤</div>
                    <h3>Вітаємо, {user.name}!</h3>
                    <p>Email: {user.email}</p>
                    <button className="btn btn-primary" onClick={() => setCurrentView('menu')} style={{marginTop: '20px'}}>
                      Повернутись до меню
                    </button>
                    <button className="btn btn-outline" onClick={() => setUser(null)} style={{marginTop: '10px'}}>
                      Вийти
                    </button>
                  </div>
                ) : (
                  <div style={{textAlign: 'center'}}>
                    <button className="btn btn-primary btn-large" onClick={handleLogin} style={{width: '100%'}}>
                      <i className="fas fa-rocket"></i> Демо вхід
                    </button>
                    <div className="demo-credentials">
                      <p><strong>Демо доступ:</strong></p>
                      <p>Email: demo@example.com</p>
                      <p>Пароль: будь-який</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
