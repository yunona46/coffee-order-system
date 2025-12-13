const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true });
    
    res.json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('Помилка отримання меню:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні меню'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Товар не знайдено'
      });
    }
    
    res.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    console.error('Помилка отримання товару:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні товару'
    });
  }
});

router.post('/seed', async (req, res) => {
  try {
    // Перевіряємо, чи вже є товари
    const existingItems = await MenuItem.countDocuments();
    
    if (existingItems > 0) {
      return res.json({
        success: true,
        message: `Товари вже існують (${existingItems} шт.)`,
        data: { count: existingItems }
      });
    }
    
    // Створюємо тестові товари
    const testItems = [
      {
        name: "Капучино",
        description: "Ароматна кава з молочною піною",
        price: 65,
        category: "coffee",
        available: true,
        image: "☕"
      },
      {
        name: "Латте",
        description: "Ніжна кава з молоком",
        price: 70,
        category: "coffee",
        available: true,
        image: "🥛"
      },
      {
        name: "Американо",
        description: "Класична чорна кава",
        price: 50,
        category: "coffee",
        available: true,
        image: "⚫"
      },
      {
        name: "Еспресо",
        description: "Міцна італійська кава",
        price: 45,
        category: "coffee",
        available: true,
        image: "☕"
      },
      {
        name: "Тірамісу",
        description: "Італійський десерт з маскарпоне",
        price: 85,
        category: "dessert",
        available: true,
        image: "🍰"
      }
    ];
    
    const created = await MenuItem.insertMany(testItems);
    
    res.json({
      success: true,
      message: `Створено ${created.length} тестових товарів`,
      data: { items: created }
    });
  } catch (error) {
    console.error('Помилка seed:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при створенні тестових даних'
    });
  }
});

module.exports = router;