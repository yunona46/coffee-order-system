const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const adminController = {
    // Get all orders (admin only)
    async getAllOrders(req, res) {
        try {
            const { status, page, limit } = req.query;
            const options = {
                status: status || undefined,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20
            };

            const result = Order.findAll(options);

            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Get all orders error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching orders',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Update order status (admin only)
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, note } = req.body;

            const order = Order.findById(parseInt(id));
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    code: 'ORDER_NOT_FOUND'
                });
            }

            const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status',
                    code: 'INVALID_STATUS'
                });
            }

            order.updateStatus(status, note || 'Status updated to ' + status);

            res.json({
                success: true,
                message: 'Order status updated successfully',
                data: {
                    order: {
                        id: order.id,
                        orderNumber: order.orderNumber,
                        status: order.status,
                        statusHistory: order.statusHistory
                    }
                }
            });

        } catch (error) {
            console.error('Update order status error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while updating order status',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Get system statistics (admin only)
    async getStatistics(req, res) {
        try {
            const users = User.findAll();
            const allOrders = Order.findAll();
            const menuItems = MenuItem.findAll();

            const totalRevenue = allOrders.orders.reduce((sum, order) => sum + order.totalAmount, 0);
            const today = new Date().toISOString().split('T')[0];
            const todayOrders = allOrders.orders.filter(order => order.createdAt.startsWith(today));

            res.json({
                success: true,
                data: {
                    statistics: {
                        totalUsers: users.length,
                        totalOrders: allOrders.pagination.totalItems,
                        totalMenuItems: menuItems.items.length,
                        totalRevenue: totalRevenue,
                        todayOrders: todayOrders.length,
                        todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
                    }
                }
            });

        } catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching statistics',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    }
};

module.exports = adminController;
