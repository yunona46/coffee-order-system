import React, { useState, useEffect } from 'react';
import './App.css';

const mockProducts = [
  { 
    id: 1, 
    name: 'Капучино', 
    description: 'Ароматна кава з молочною піною', 
    price: 65, 
    category: 'coffee', 
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 2, 
    name: 'Лате', 
    description: 'Ніжна кава з великою кількістю молока', 
    price: 70, 
    category: 'coffee', 
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 3, 
    name: 'Еспресо', 
    description: 'Класичний міцний еспресо', 
    price: 50, 
    category: 'coffee', 
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 4, 
    name: 'Американо', 
    description: 'Чорна кава з водою', 
    price: 55, 
    category: 'coffee', 
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 5, 
    name: 'Чай зелений', 
    description: 'Освіжаючий зелений чай', 
    price: 45, 
    category: 'tea', 
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 6, 
    name: 'Чай чорний', 
    description: 'Ароматний чорний чай', 
    price: 45, 
    category: 'tea', 
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 7, 
    name: 'Тірамісу', 
    description: 'Італійський десерт з маскарпоне', 
    price: 85, 
    category: 'dessert', 
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 8, 
    name: 'Круасан', 
    description: 'Свіжий французький круасан', 
    price: 40, 
    category: 'dessert', 
    image: 'https://images.unsplash.com/photo-1691480162735-9b91238080f6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JvaXNzYW50fGVufDB8fDB8fHww'
  },
  { 
    id: 9, 
    name: 'Чізкейк', 
    description: 'Ніжний чізкейк Нью-Йорк', 
    price: 75, 
    category: 'dessert', 
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  },
  { 
    id: 10, 
    name: 'Печиво', 
    description: 'Домашнє шоколадне печиво', 
    price: 25, 
    category: 'dessert', 
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
  }
];

const categories = [
  { id: 'all', name: 'Всі товари', icon: '🍽️' },
  { id: 'coffee', name: 'Кава', icon: '☕' },
  { id: 'tea', name: 'Чай', icon: '🍵' },
  { id: 'dessert', name: 'Десерти', icon: '🍰' }
];

// Компонент сповіщення
const Notification = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="notification">
      <div className="notification-content">
        <i className="fas fa-check-circle"></i>
        {message}
        <button className="notification-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

// Компонент прогрес бару
const OrderProgress = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Очікує', icon: '⏳' },
    { key: 'preparing', label: 'Готується', icon: '👨‍🍳' },
    { key: 'ready', label: 'Готове', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === status);

  return (
    <div className="order-progress">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className={`progress-step ${
            index <= currentStepIndex ? 'active' : ''
          }`}
          title={step.label}
        >
          {step.icon}
          <span className="progress-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

// Компонент картки товару
const ProductCard = ({ product, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {!imageLoaded && (
          <div className="image-placeholder">
            <i className="fas fa-image"></i>
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {imageError && (
          <div className="image-fallback">
            <i className="fas fa-coffee"></i>
          </div>
        )}
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-description">{product.description}</div>
        <div className="product-footer">
          <div className="product-price">{product.price} ₴</div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onAddToCart(product)}
          >
            <i className="fas fa-plus"></i> Додати
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('menu');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [notification, setNotification] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Завантажуємо дані з localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('coffeeShopCart');
    const savedUser = localStorage.getItem('coffeeShopUser');
    const savedOrders = localStorage.getItem('coffeeShopOrders');
    const savedTheme = localStorage.getItem('coffeeShopTheme');
    
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedTheme) setIsDarkTheme(JSON.parse(savedTheme));
  }, []);

  // Зберігаємо дані в localStorage
  useEffect(() => {
    localStorage.setItem('coffeeShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('coffeeShopUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('coffeeShopOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('coffeeShopTheme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  // Функція для сповіщень
  const showNotification = (message) => {
    setNotification(message);
  };

  // Функція підтвердження дій
  const confirmAction = (message, onConfirm) => {
    if (window.confirm(message)) {
      onConfirm();
    }
  };

  // Фільтруємо та сортуємо продукти
  const filteredProducts = (currentCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === currentCategory)
  )
  .filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price - b.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  // Функції для кошика
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      const newItems = existingItem 
        ? prev.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
      
      showNotification(`"${product.name}" додано до кошика! 🛒`);
      return newItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      confirmAction(
        'Видалити цей товар з кошика?',
        () => removeFromCart(productId)
      );
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showNotification('Товар видалено з кошика ❌');
  };

  // Функції для аутентифікації
  const handleLogin = () => {
    const userData = { 
      id: 1, 
      name: 'Демо Користувач', 
      email: 'demo@example.com' 
    };
    setUser(userData);
    setCurrentView('menu');
    showNotification('Вітаємо в системі! 👋');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('menu');
    showNotification('До побачення! 👋');
  };

  // Функція оформлення замовлення
  const handleCheckout = () => {
    if (!user) {
      setCurrentView('auth');
      showNotification('Будь ласка, увійдіть в систему! 🔐');
      return;
    }

    if (cartItems.length === 0) {
      showNotification('Кошик порожній! 🛒');
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: [...cartItems],
      total: total,
      status: 'preparing',
      time: new Date().toLocaleString('uk-UA')
    };

    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setCurrentView('orders');
    
    showNotification(`Замовлення #${newOrder.id} успішно оформлено! 🎉`);
  };

  // Функція скасування замовлення
  const cancelOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
    showNotification('Замовлення скасовано ❌');
  };

  // Розрахунки
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
      <Notification 
        message={notification} 
        onClose={() => setNotification('')} 
      />
      
      {/* Header */}
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
            
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              title={isDarkTheme ? 'Світла тема' : 'Темна тема'}
            >
              <i className={`fas ${isDarkTheme ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            
            <div className="user-menu">
              {user ? (
                <button className="nav-link" onClick={handleLogout}>
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

      <main className="main">
        <div className="container">
          {/* Меню */}
          {currentView === 'menu' && (
            <section className="menu">
              <h2>Наше Меню</h2>
              
              {/* Панель пошуку та фільтрів */}
              <div className="menu-controls">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Пошук товарів..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Сортувати за назвою</option>
                  <option value="price">Сортувати за ціною</option>
                </select>
              </div>

              <div className="categories">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${currentCategory === category.id ? 'active' : ''}`}
                    onClick={() => setCurrentCategory(category.id)}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="products-grid">
                {filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h2>Товари не знайдено</h2>
                    <p>Спробуйте змінити пошуковий запит або категорію</p>
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                    />
                  ))
                )}
              </div>
            </section>
          )}

          {/* Кошик */}
          {currentView === 'cart' && (
            <section className="cart">
              <h2>Кошик</h2>
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-state">
                    <div className="empty-icon">🛒</div>
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
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <div className="item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div>
                            <h4>{item.name}</h4>
                            <div className="item-price">{item.price} ₴</div>
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
                        
                        <div className="item-total">{item.price * item.quantity} ₴</div>
                        
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmAction(
                            'Видалити цей товар з кошика?',
                            () => removeFromCart(item.id)
                          )}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-section">
                    <div className="pickup-time">
                      <label htmlFor="pickup-time">
                        <i className="fas fa-clock"></i> Час забирання:
                      </label>
                      <select id="pickup-time">
                        <option>Якомога швидше</option>
                        <option>Через 15 хвилин</option>
                        <option>Через 30 хвилин</option>
                        <option>Через 45 хвилин</option>
                        <option>Через 1 годину</option>
                      </select>
                    </div>
                    
                    <div className="total-section">
                      <h3>Загальна сума: {total} ₴</h3>
                      {!user && (
                        <p style={{color: 'var(--warning-color)', marginBottom: '15px'}}>
                          <i className="fas fa-exclamation-triangle"></i> Увійдіть для оформлення замовлення
                        </p>
                      )}
                      <button 
                        className="btn btn-primary btn-large"
                        onClick={handleCheckout}
                        disabled={!user}
                      >
                        <i className="fas fa-credit-card"></i> Оформити замовлення
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Авторизація */}
          {currentView === 'auth' && (
            <section className="auth">
              <div className="auth-form">
                <h2>Вхід в систему</h2>
                <div style={{textAlign: 'center'}}>
                  <button 
                    className="btn btn-primary btn-large" 
                    onClick={handleLogin}
                    style={{width: '100%', marginBottom: '20px'}}
                  >
                    <i className="fas fa-rocket"></i> Демо вхід
                  </button>
                  
                  <div className="demo-credentials">
                    <p><strong>Демо доступ:</strong></p>
                    <p>Автоматичний вхід як демо-користувач</p>
                  </div>
                  
                  <button 
                    className="link-btn" 
                    onClick={() => setCurrentView('menu')}
                    style={{marginTop: '15px'}}
                  >
                    ← Повернутись до меню
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Замовлення */}
          {currentView === 'orders' && (
            <section className="orders">
              <h2>Мої Замовлення</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h2>Замовлень ще немає</h2>
                  <p>Зробіть перше замовлення!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setCurrentView('menu')}
                  >
                    <i className="fas fa-utensils"></i> Перейти до меню
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <h3>Замовлення #{order.id}</h3>
                        <div>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => confirmAction(
                              'Скасувати це замовлення?',
                              () => cancelOrder(order.id)
                            )}
                          >
                            Скасувати
                          </button>
                        </div>
                      </div>
                      
                      <OrderProgress status={order.status} />
                      
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="order-item">
                            <div className="order-item-info">
                              <img src={item.image} alt={item.name} className="order-item-image" />
                              <span>{item.name} x {item.quantity}</span>
                            </div>
                            <span>{item.price * item.quantity} ₴</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-info">
                          <strong>Загальна сума:</strong> {order.total} ₴
                        </div>
                        <div className="order-info">
                          <strong>Час замовлення:</strong> {order.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;