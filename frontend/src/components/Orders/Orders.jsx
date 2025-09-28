import React from 'react';
import OrderCard from '../OrderCard/OrderCard';
import './Orders.css';

const Orders = ({ orders, onCancelOrder, setCurrentView }) => {
  if (orders.length === 0) {
    return (
      <section className="orders" role="main" aria-labelledby="orders-title">
        <h2 id="orders-title">Мої Замовлення</h2>
        <div className="empty-state" role="status">
          <div className="empty-icon" aria-hidden="true">📦</div>
          <h3>Замовлень ще немає</h3>
          <p>Зробіть своє перше замовлення прямо зараз!</p>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentView('menu')}
            aria-label="Перейти до меню для створення замовлення"
          >
            <i className="fas fa-utensils" aria-hidden="true"></i> Перейти до меню
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="orders" role="main" aria-labelledby="orders-title">
      <h2 id="orders-title">Мої Замовлення</h2>
      
      <div className="orders-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Всього замовлень</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {orders.filter(order => order.status === 'ready').length}
            </span>
            <span className="stat-label">Готових</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {orders.filter(order => order.status === 'preparing').length}
            </span>
            <span className="stat-label">Готується</span>
          </div>
        </div>
      </div>

      <div className="orders-list" role="list" aria-label="Список ваших замовлень">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={onCancelOrder}
          />
        ))}
      </div>
    </section>
  );
};

export default Orders;