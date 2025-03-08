const Order = require("../models/Order");
const User = require("../models/User");
const Service = require("../models/Service");

//create order
const createOrder = async (req, res) => {
    try {
        const {serviceId, amount, description, buyerName, buyerEmail, buyerPhone, buyerAddress, items, currency, paymentMethod, paymentStatus, transactionDateTime } = req.body;
        const memberID = req.user.id;
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const newOrder = new Order({
            memberId: memberID , serviceId: serviceId, amount, description, buyerName, buyerEmail, buyerPhone, buyerAddress, items, currency, paymentMethod, paymentStatus, transactionDateTime
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get order by member
const getOrdersByMemberId = async (req, res) => {
    try {
        const memberId = req.user.id;
        // find orders by member id where orders status is Paid
        const orders = await Order.find({ memberId});
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    createOrder,
    getOrdersByMemberId,
    getAllOrders,
    deleteOrder
}
