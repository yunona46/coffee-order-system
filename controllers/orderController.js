import orderService from "../services/orderService.js";
import { asyncHandler } from "../utils/helpers.js";

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const order = await orderService.createOrder(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Замовлення успішно створено",
      data: { order }
    });
  });

  getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await orderService.getUserOrders(userId, req.query);

    res.json({
      success: true,
      data: result
    });
  });

  getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await orderService.getOrderById(id, userId);

    res.json({
      success: true,
      data: { order }
    });
  });

  cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const order = await orderService.cancelOrder(id, userId, reason);

    res.json({
      success: true,
      message: "Замовлення скасовано",
      data: { order }
    });
  });

  // Адміністративні методи
  getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      import("../models/Order.js").then(module => 
        module.default.find(query)
          .populate("user", "firstName lastName email phone")
          .populate("items.menuItem", "name")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
      ),
      import("../models/Order.js").then(module => 
        module.default.countDocuments(query)
      )
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalItems: totalOrders
        }
      }
    });
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const updatedBy = req.user.id;

    const order = await orderService.updateOrderStatus(id, status, note, updatedBy);

    res.json({
      success: true,
      message: "Статус замовлення оновлено",
      data: { order }
    });
  });

  getOrderStatistics = asyncHandler(async (req, res) => {
    const stats = await orderService.getOrderStatistics(req.query);

    res.json({
      success: true,
      data: { statistics: stats }
    });
  });
}

const orderController = new OrderController();
export default orderController;
