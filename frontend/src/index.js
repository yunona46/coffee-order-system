import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Додаємо дебаг інформацію
console.log('🚀 Coffee Shop App запускається...');
console.log('✅ React версія:', React.version);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Додаємо обробку помилок
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ Додаток успішно відрендерений');
} catch (error) {
  console.error('❌ Помилка рендерингу:', error);
}