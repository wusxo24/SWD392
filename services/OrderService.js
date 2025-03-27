const Order = require("../models/Order");
const Service = require("../models/Service");
const User = require("../models/User");
const Member = require("../models/MemberInfo");
const Record = require("../models/Record");
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
const createOrderForMobile = async (orderData, userId) => {
    const { serviceId } = orderData;
    const service = await Service.findById(serviceId);
    if (!service) {
        throw new Error("Service not found");
    }

    
    let orderCode;
    let index = 0;
    const orderCodeCount = await Order.countDocuments({ status: "Paid" });
    while (index < orderCodeCount) {
        index++;
        orderCode = Number(Date.now().toString().slice(-8) + Math.floor(Math.random() * 100).toString().padStart(2, '0'));

        const existingOrderCodeOrder = await Order.findOne({ orderCode });
        if (!existingOrderCodeOrder) {
            break;
        }
    }
    if (index > orderCodeCount) {
        throw new Error("Please try again!");
    }

    const newOrder = new Order({
        memberId: userId,
        serviceId,
        status: "Paid",
        amount: service.price,
        orderCode,
        description: "Thanh toan dich vu"
    });
    await newOrder.save();

    const order = await Order.findOne({ orderCode });
    const newRecord = new Record({
        OrderId: order._id,
    });
    await newRecord.save();


    return newOrder;
};
module.exports = {
    createOrder,
    getOrdersByMemberId,
    getAllOrders,
    deleteOrder,
    getOrderByOrderCode,
    createOrderForMobile
};