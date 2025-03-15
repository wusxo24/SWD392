const PaymentService = require("../services/PaymentService");
const dotenv = require('dotenv');
dotenv.config();

const createEmmbeddedPaymentLink = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.id;
        const paymentLinkData = await PaymentService.createEmmbeddedPaymentLink(serviceId, userId);

        return res.json({
            error: 0,
            message: "Success",
            data: paymentLinkData,
        });
    } catch (error) {
        console.error("Error creating payment link:", error);
        return res.json({
            error: -1,
            message: "Please try again!",
            data: null,
        });
    }
};

const receivePayment = async (req, res) => {
    try {
        const data = req.body;
        const response = await PaymentService.receivePayment(data);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error processing webhook:", error);
        return res.status(500).json({ error: 1, message: "Internal server error" });
    }
};

module.exports = { createEmmbeddedPaymentLink, receivePayment };