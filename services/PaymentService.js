const PayOS = require('../utils/payos');
const Order = require("../models/Order");
const Service = require("../models/Service");
const User = require("../models/User");
const Member = require("../models/MemberInfo");
const Record = require("../models/Record");

const createEmmbeddedPaymentLink = async (serviceId, userId) => {
    const user = await User.findById(userId);
    const member = await Member.findOne({ user_id: userId });
    const service = await Service.findById(serviceId);
    const transactionDateTime = new Date();

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
        status: "Pending",
        amount: service.price,
        orderCode,
        description: "Thanh toan dich vu",
        buyerName: member.fullname,
        buyerEmail: user.email,
        buyerPhone: member.phone,
        buyerAddress: member.address,
        transactionDateTime: transactionDateTime
    });
    await newOrder.save();

    const amount = service.price;
    const description = "Thanh toan dich vu";
    const items = [{ name: service.name, quantity: 1, price: service.price }];
    const returnUrl = process.env.RETURN_URL || "http://localhost:3000";
    const cancelUrl = process.env.CANCEL_URL || "http://localhost:3000/cancel";

    const paymentLinkRes = await PayOS.createPaymentLink({
        orderCode,
        amount,
        description,
        items,
        returnUrl,
        cancelUrl,
    });

    return {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode,
    };
};

const receivePayment = async (data) => {
    if (data.data.orderCode == 123) {
        return { error: 0, message: "Success" };
    }

    console.log("Webhook received:", data);
    const orderCode = data.data?.orderCode;
    
    if (!orderCode) {
        return { error: 1, message: "Invalid payment data" };
    }

    const order = await Order.findOne({ orderCode });

    if (!order) {
        console.log(`Order with orderCode ${orderCode} not found.`);
        return { error: 1, message: "Order not found" };
    }

    if (data.success) {
        order.status = "Paid";
        order.currency = data.data.currency;
        order.paymentMethod = "PayOS";
        order.paymentStatus = data.data.desc || "Payment Successful";
        console.log(`Order ${orderCode} updated to Paid.`);

        const newRecord = new Record({
            OrderId: order._id,
        });

        await newRecord.save();
        console.log(`Record created for order ${orderCode}`);
    } else {
        order.status = "Canceled";
        order.paymentStatus = data.data.desc || "Payment Failed";
        console.log(`Order ${orderCode} updated to Canceled.`);
    }

    await order.save();

    return { error: 0, message: "Order updated successfully", order };
};

module.exports = { createEmmbeddedPaymentLink, receivePayment };