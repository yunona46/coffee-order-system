const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/v1/menu - отримання меню з фільтрацією
router.get('/', menuController.getMenu);

// GET /api/v1/menu/:id - отримання конкретної позиції меню
router.get('/:id', menuController.getMenuItem);

module.exports = router;
