// Скрипт для швидкого оновлення фронтенду
const fs = require('fs');
const path = require('path');

// Оновлений App.js
const appJsContent = `// ... [весь код App.js зверху] ...`;

// Оновлений App.css  
const appCssContent = `/* ... [весь код App.css зверху] ... */`;

fs.writeFileSync(path.join(__dirname, 'src', 'App.js'), appJsContent);
fs.writeFileSync(path.join(__dirname, 'src', 'App.css'), appCssContent);

console.log('✅ Frontend оновлено! Перезапустіть сервер: npm start');