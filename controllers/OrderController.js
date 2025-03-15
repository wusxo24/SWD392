const OrderService = require("../services/OrderService");

// Create order
const createOrder = async (req, res) => {
    try {
        const newOrder = await OrderService.createOrder(req.body, req.user.id);
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get orders by member ID
const getOrdersByMemberId = async (req, res) => {
    try {
        const orders = await OrderService.getOrdersByMemberId(req.user.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        await OrderService.deleteOrder(req.params.orderId);
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by order code
const getOrderByOrderCode = async (req, res) => {
    try {
        const order = await OrderService.getOrderByOrderCode(req.params.orderCode);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrdersByMemberId,
    getAllOrders,
    getOrderByOrderCode,
    deleteOrder
};