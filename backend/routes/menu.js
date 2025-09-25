const express = require('express');
const router = express.Router();

// Тимофійні дані меню
const menuItems = [
    { id: 1, name: "Еспресо", price: 25, category: "espresso" },
    { id: 2, name: "Капучино", price: 35, category: "espresso" },
    { id: 3, name: "Лате", price: 40, category: "milk" }
];

// GET /api/menu - отримати все меню
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: menuItems,
        count: menuItems.length
    });
});

// GET /api/menu/:id - отримати каву по ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = menuItems.find(coffee => coffee.id === id);
    
    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Кава не знайдена"
        });
    }
    
    res.json({
        success: true,
        data: item
    });
});

module.exports = router;
