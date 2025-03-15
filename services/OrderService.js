const Order = require("../models/Order");
const Service = require("../models/Service");

const createOrder = async (orderData, userId) => {
    const { serviceId, amount, description, buyerName, buyerEmail, buyerPhone, buyerAddress, items, currency, paymentMethod, paymentStatus, transactionDateTime } = orderData;
    const service = await Service.findById(serviceId);
    if (!service) {
        throw new Error("Service not found");
    }

    const newOrder = new Order({
        memberId: userId,
        serviceId: serviceId,
        amount,
        description,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress,
        items,
        currency,
        paymentMethod,
        paymentStatus,
        transactionDateTime
    });

    await newOrder.save();
    return newOrder;
};

const getOrdersByMemberId = async (memberId) => {
    const orders = await Order.find({ memberId });
    if (!orders.length) {
        throw new Error("No orders found");
    }
    return orders;
};

const getAllOrders = async () => {
    const orders = await Order.find();
    if (!orders.length) {
        throw new Error("No orders found");
    }
    return orders;
};

const deleteOrder = async (orderId) => {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        throw new Error("Order not found");
    }
    return deletedOrder;
};

const getOrderByOrderCode = async (orderCode) => {
    const order = await Order.findOne({ orderCode });
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
};

module.exports = {
    createOrder,
    getOrdersByMemberId,
    getAllOrders,
    deleteOrder,
    getOrderByOrderCode
};