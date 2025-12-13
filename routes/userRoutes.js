const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
    res.json({ 
        success: true, 
        data: { 
            user: { id: 1, name: 'Тестовий користувач', email: 'test@example.com' } 
        } 
    });
});

module.exports = router;