import React, { useState, useEffect } from 'react';
import './App.css';

const mockProducts = [
  {
    id: 1,
    name: 'Капучино',
    description: 'Ароматна кава з молочною піною',
    price: 65,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Лате',
    description: 'Ніжна кава з великою кількістю молока',
    price: 70,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Еспресо',
    description: 'Класичний міцний еспресо',
    price: 50,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    name: 'Американо',
    description: 'Чорна кава з водою',
    price: 55,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
];

const categories = [
  { id: 'all', name: 'Всі товари', icon: '🍽️' },
  { id: 'coffee', name: 'Кава', icon: '☕' },
  { id: 'tea', name: 'Чай', icon: '🍵' },
  { id: 'dessert', name: 'Десерти', icon: '🍰' }
];

// Решта коду залишається як у вашому оригінальному файлі...
const App = () => {
  // Ваша логіка тут
  return (
    <div className="app">
      <h1>Coffee Order System</h1>
    </div>
  );
};

export default App;

