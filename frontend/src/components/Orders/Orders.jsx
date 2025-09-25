import React, { useState, useEffect } from 'react';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Завантажуємо замовлення з localStorage
    const savedOrders = localStorage.getItem('coffeeShopOrders');
    const mockOrders = [
      {
        id: 1,
        items: [
          { name: "Капучино", price: 65, quantity: 1 },
          { name: "Тірамісу", price: 85, quantity: 1 }
        ],
        total: 150,
        status: 'ready',
        pickupTime: '14:30',
        createdAt: new Date().toISOString()
      }
    ];

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(mockOrders);
    }
    setLoading(false);
  }, []);

  // Функція для додавання нового замовлення (викликається з Cart)
  const addNewOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'preparing',
      createdAt: new Date().toISOString()
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('coffeeShopOrders', JSON.stringify(updatedOrders));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
        <p>Завантаження замовлень...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h2>Замовлень ще немає</h2>
        <p>Ваші майбутні замовлення з'являться тут</p>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { text: 'Очікує', class: 'status-pending' };
      case 'preparing': return { text: 'Готується', class: 'status-preparing' };
      case 'ready': return { text: 'Готове', class: 'status-ready' };
      default: return { text: status, class: 'status-pending' };
    }
  };

  return (
    <div className="orders">
      <h2>Мої замовлення</h2>
      
      <div className="orders-list">
        {orders.map(order => {
          const statusInfo = getStatusInfo(order.status);
          
          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Замовлення #{order.id}</h3>
                <span className={`status-badge ${statusInfo.class}`}>
                  {statusInfo.text}
                </span>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{item.price * item.quantity} ₴</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-info">
                  <p><strong>Час забирання:</strong> {order.pickupTime}</p>
                  <p><strong>Загальна сума:</strong> {order.total} ₴</p>
                  <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString('uk-UA')}</p>
                </div>
                
                {order.status === 'pending' && (
                  <button className="btn btn-danger btn-sm">
                    Скасувати
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
