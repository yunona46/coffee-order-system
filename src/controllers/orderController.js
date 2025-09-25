const Order = require('../models/Order');
const Cart = require('../models/Cart');

const orderController = {
    // Create new order from cart
    async createOrder(req, res) {
        try {
            const { 
                deliveryType, 
                paymentMethod, 
                deliveryAddress, 
                contactPhone, 
                preferredDeliveryTime, 
                orderNotes 
            } = req.body;

            // Validate required fields
            if (!deliveryType || !paymentMethod || !contactPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'Delivery type, payment method, and contact phone are required',
                    code: 'VALIDATION_ERROR'
                });
            }

            // Get user's cart
            const cart = Cart.getByUserId(req.user.userId);
            
            // Check if cart is empty
            if (cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart is empty',
                    code: 'CART_EMPTY'
                });
            }

            // Calculate order summary
            const summary = cart.getSummary();

            // Create order
            const orderData = {
                userId: req.user.userId,
                items: cart.items,
                subtotal: summary.subtotal,
                taxes: summary.taxes,
                deliveryFee: summary.deliveryFee,
                totalAmount: summary.totalAmount,
                deliveryType: deliveryType,
                deliveryAddress: deliveryAddress,
                contactPhone: contactPhone,
                paymentMethod: paymentMethod,
                preferredDeliveryTime: preferredDeliveryTime,
                orderNotes: orderNotes
            };

            const order = new Order(orderData);
            
            // Update order status to confirmed
            order.updateStatus('confirmed', 'Order confirmed and sent to kitchen');
            
            // Clear the cart after successful order
            cart.clear();

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: {
                    order: {
                        id: order.id,
                        orderNumber: order.orderNumber,
                        status: order.status,
                        items: order.items,
                        subtotal: order.subtotal,
                        taxes: order.taxes,
                        deliveryFee: order.deliveryFee,
                        totalAmount: order.totalAmount,
                        deliveryType: order.deliveryType,
                        paymentMethod: order.paymentMethod,
                        paymentStatus: order.paymentStatus,
                        estimatedDeliveryTime: order.getEstimatedDeliveryTime(),
                        createdAt: order.createdAt
                    }
                }
            });

        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while creating order',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Get user's orders
    async getOrders(req, res) {
        try {
            const { status, page, limit } = req.query;
            const options = {
                status: status || undefined,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20
            };

            const result = Order.findByUserId(req.user.userId, options);

            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Get orders error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching orders',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    },

    // Get single order by ID
    async getOrder(req, res) {
        try {
            const { id } = req.params;
            const order = Order.findById(parseInt(id));

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    code: 'ORDER_NOT_FOUND'
                });
            }

            // Check if user owns the order or is admin
            if (order.userId !== req.user.userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied',
                    code: 'ACCESS_DENIED'
                });
            }

            res.json({
                success: true,
                data: {
                    order: order
                }
            });

        } catch (error) {
            console.error('Get order error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error while fetching order',
                code: 'INTERNAL_SERVER_ERROR'
            });
        }
    }
};

module.exports = orderController;
