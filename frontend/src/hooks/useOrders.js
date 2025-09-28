import { useState, useCallback, useMemo } from 'react';
import { orderService } from '../services/orderService';

export const useOrders = (initialOrders = []) => {
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newOrder = await orderService.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      
      // Симуляція зміни статусу
      setTimeout(() => {
        setOrders(prev => prev.map(order => 
          order.id === newOrder.id ? { ...order, status: 'preparing' } : order
        ));
      }, 2000);

      setTimeout(() => {
        setOrders(prev => prev.map(order => 
          order.id === newOrder.id ? { ...order, status: 'ready' } : order
        ));
      }, 8000);

      return newOrder;
    } catch (error) {
      setError(error.message || 'Помилка створення замовлення');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      await orderService.cancelOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      setError(error.message || 'Помилка скасування замовлення');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  }, []);

  // Статистика замовлень
  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const preparing = orders.filter(order => order.status === 'preparing').length;
    const ready = orders.filter(order => order.status === 'ready').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;

    return { total, pending, preparing, ready, cancelled };
  }, [orders]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    isLoading,
    error,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    orderStats,
    clearError
  };
};