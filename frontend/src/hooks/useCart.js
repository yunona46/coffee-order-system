import { useState, useEffect } from 'react';
import { calculateCartTotal, calculateCartItemsCount } from '../utils/helpers';

export const useCart = () => {
  const [items, setItems] = useState([]);

  // Завантажуємо кошик з localStorage при ініціалізації
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Зберігаємо кошик в localStorage при зміні
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total: calculateCartTotal(items),
    itemsCount: calculateCartItemsCount(items)
  };
};