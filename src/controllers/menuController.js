const MenuItem = require('../models/MenuItem');

const menuController = {
    async getMenu(req, res) {
        try {
            const {
                category,
                available,
                minPrice,
                maxPrice,
                sortBy,
                page = 1,
                limit = 20
            } = req.query;

            const options = {
                category: category || undefined,
                available: available !== undefined ? available === 'true' : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                sortBy: sortBy || undefined,
                page: parseInt(page),
                limit: Math.min(parseInt(limit), 100)
            };

            const result = MenuItem.findAll(options);

            res.json({
                success: true,
                data: {
                    items: result.items,
                    pagination: result.pagination
                }
            });

        } catch (error) {
            console.error('Get menu error:', error);
            res.status(500).json({
                success: false,
                message: 'Помилка отримання меню'
            });
        }
    },

    async getMenuItem(req, res) {
        try {
            const { id } = req.params;
            const item = MenuItem.findById(parseInt(id));

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Позицію меню не знайдено'
                });
            }

            res.json({
                success: true,
                data: {
                    item: item
                }
            });

        } catch (error) {
            console.error('Get menu item error:', error);
            res.status(500).json({
                success: false,
                message: 'Помилка отримання позиції меню'
            });
        }
    }
};

module.exports = menuController;
