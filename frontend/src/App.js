import React, { useState } from 'react';
import './App.css';

// Mock data для тестування
const mockProducts = [
  { id: 1, name: 'Капучино', price: 65, category: 'coffee', emoji: '☕', description: 'Ароматна кава з молочною піною' },
  { id: 2, name: 'Лате', price: 70, category: 'coffee', emoji: '🥛', description: 'Ніжна кава з молоком' },
  { id: 3, name: 'Еспресо', price: 50, category: 'coffee', emoji: '⚫', description: 'Класичний міцний еспресо' },
  { id: 4, name: 'Чай зелений', price: 45, category: 'tea', emoji: '🍵', description: 'Освіжаючий зелений чай' },
  { id: 5, name: 'Тірамісу', price: 85, category: 'dessert', emoji: '🍰', description: 'Класичний італійський десерт' }, 
  { id: 6, name: 'Американо', price: 55, category: 'coffee', emoji: '☕', description: 'Класичний американо' },
  { id: 7, name: 'Мокачіно', price: 75, category: 'coffee', emoji: '🍫', description: 'Кава з шоколадом' },
  { id: 8, name: 'Флет-Уайт', price: 70, category: 'coffee', emoji: '🥛', description: 'Ніжний флет-уайт' },
  { id: 9, name: 'Чай чорний', price: 40, category: 'tea', emoji: '🍵', description: 'Ароматний чорний чай' },
  { id: 10, name: 'Какао', price: 60, category: 'drink', emoji: '🥤', description: 'Солодке какао' },
  { id: 11, name: 'Круасан', price: 45, category: 'dessert', emoji: '🥐', description: 'Свіжий круасан' },
  { id: 12, name: 'Чізкейк', price: 95, category: 'dessert', emoji: '🍰', description: 'Ніжний чізкейк' }
];

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [cart, setCart] = useState([]);
  const [user, _setUser] = useState(null); 

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Компонент Header
  const Header = () => (
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
            className={`nav-link cart-btn ${currentView === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentView('cart')}
          >
            <i className="fas fa-shopping-cart"></i> Кошик
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
          <button 
            className={`nav-link ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentView('orders')}
          >
            <i className="fas fa-history"></i> Замовлення
          </button>
          <div className="user-menu">
            {user ? (
              <span>Вітаємо, {user.name}!</span>
            ) : (
              <button 
                className="nav-link"
                onClick={() => setCurrentView('auth')}
              >
                <i className="fas fa-user"></i> Увійти
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );

  // Компонент Меню
  const Menu = () => (
    <section className="menu">
      <div className="container">
        <h2>Наше меню</h2>
        <div className="products-grid">
          {mockProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span className="product-emoji">{product.emoji}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{product.price} ₴</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    <i className="fas fa-plus"></i> Додати
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Компонент Кошика
  const Cart = () => {
    if (cart.length === 0) {
      return (
        <section className="cart">
          <div className="container">
            <div className="empty-cart">
              <div className="empty-state">
                <i className="fas fa-shopping-cart empty-icon"></i>
                <h2>Кошик порожній</h2>
                <p>Додайте товари з меню</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setCurrentView('menu')}
                >
                  <i className="fas fa-utensils"></i> Перейти до меню
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="cart">
        <div className="container">
          <h2>Ваше замовлення</h2>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-emoji">{item.emoji}</span>
                  <div>
                    <h4>{item.name}</h4>
                    <p className="item-price">{item.price} ₴</p>
                  </div>
                </div>
                <div className="quantity-controls">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <span className="item-total">{item.price * item.quantity} ₴</span>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="checkout-section">
            <div className="pickup-time">
              <label>Час забирання:</label>
              <select>
                <option>Якомога швидше</option>
                <option>Через 15 хвилин</option>
                <option>Через 30 хвилин</option>
                <option>Через 1 годину</option>
              </select>
            </div>
            
            <div className="total-section">
              <h3>Загальна сума: {getTotalPrice()} ₴</h3>
              <button className="btn btn-accent btn-large">
                <i className="fas fa-credit-card"></i> Оформити замовлення
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Компонент Авторизації
  const Auth = () => (
    <section className="auth">
      <div className="container">
        <div className="auth-form">
          <h2>Вхід в систему</h2>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{width: '100%'}}>
            Увійти
          </button>
          <div className="auth-switch">
            <p>Ще не маєте акаунту? <button className="link-btn">Зареєструватися</button></p>
          </div>
          <div className="demo-credentials">
            <p><strong>Демо доступ:</strong></p>
            <p>Email: demo@coffee.com</p>
            <p>Пароль: demo123</p>
          </div>
        </div>
      </div>
    </section>
  );

  // Компонент Замовлень
  const Orders = () => (
    <section className="orders">
      <div className="container">
        <h2>Історія замовлень</h2>
        <div className="empty-state">
          <i className="fas fa-history empty-icon"></i>
          <h2>Замовлень ще немає</h2>
          <p>Зробіть ваше перше замовлення!</p>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentView('menu')}
          >
            <i className="fas fa-utensils"></i> Перейти до меню
          </button>
        </div>
      </div>
    </section>
  );

  // Вибір поточного компоненту
  const renderCurrentView = () => {
    switch (currentView) {
      case 'menu':
        return <Menu />;
      case 'cart':
        return <Cart />;
      case 'auth':
        return <Auth />;
      case 'orders':
        return <Orders />;
      default:
        return <Menu />;
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;