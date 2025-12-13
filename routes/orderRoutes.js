const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, data: { orders: [] } });
});

router.post('/', (req, res) => {
    res.json({ success: true, message: 'Замовлення створено (mock)', orderId: 1 });
});

module.exports = router;