const PayOS = require('../utils/payos');
const Order = require("../models/Order");
const Service = require("../models/Service");
const User = require("../models/User");
const Member = require("../models/MemberInfo");
const createEmmbeddedPaymentLink = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        const member = await Member.findOne({ user_id: userId });
        const service = await Service.findById(serviceId);
        const orderCode = Number(String(Date.now()).slice(-6));
        const newOrder = new Order({
          memberId: userId,
          serviceId,
          status: "Pending",
          amount: service.price,
          orderCode,
          amount: service.price,
          description: "Thanh toan dich vu",
          buyerName: member.fullname,
          buyerEmail: user.email,
          buyerPhone: member.phone,
          buyerAddress: member.address,
        });
        await newOrder.save();
        
        const amount = service.price;
        const description = "Thanh toan dich vu";
        const items = [{ name: service.name, quantity: 1, price: service.price }];
        const returnUrl = "http://localhost:3000";
        const cancelUrl = "http://localhost:3000/cancel";
        try{
            const paymentLinkRes = await PayOS.createPaymentLink({
                orderCode,
                amount,
                description,
                items,
                returnUrl,
                cancelUrl,
            });

            

            return res.json({
                error: 0,
                message: "Success",
                data: {
                  bin: paymentLinkRes.bin,
                  checkoutUrl: paymentLinkRes.checkoutUrl,
                  accountNumber: paymentLinkRes.accountNumber,
                  accountName: paymentLinkRes.accountName,
                  amount: paymentLinkRes.amount,
                  description: paymentLinkRes.description,
                  orderCode: paymentLinkRes.orderCode,
                  qrCode: paymentLinkRes.qrCode,
                },
              });
            
        }
        catch (error) {
            console.log(error);
            return res.json({
              error: -1,
              message: "fail",
              data: null,
            });
          }
        } catch (error) {
            console.log(error);
        };
    }
// https://bb99-42-119-228-169.ngrok-free.app/api/payments/receive-hook
const receivePayment = async (req, res) => {
  try {
      let data = req.body;
      if (data.data.orderCode == 123){
          return res.status(200).json({ error: 0, message: "Success" });
      }
      console.log('Webhook received:', data);
    
      if (data.data && data.data.orderCode) {
          const orderCode = data.data.orderCode; 
          
          const order = await Order.findOne({ orderCode });
          
          if (!order) {
              console.log(`Order with orderCode ${orderCode} not found.`);
              return res.status(404).json({ error: 1, message: "Order not found" });
          }
          
          if (data.success) {
              order.status = "Paid";
              order.currency = data.data.currency;
              order.paymentMethod = "PayOS";
              order.paymentStatus = data.data.desc || "Payment Successful";
              order.transactionDateTime = new Date(data.data.transactionDateTime);
              console.log(`Order ${orderCode} updated to Paid.`);
          } else {
              order.status = "Canceled";
              order.paymentStatus = data.data.desc || "Payment Failed";
              console.log(`Order ${orderCode} updated to Canceled.`);
          }
    
          await order.save();

          return res.status(200).json({ error: 0, message: "Order updated successfully", order });
      }
      return res.status(400).json({ error: 1, message: "Invalid payment data" });
  } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).json({ error: 1, message: "Internal server error" });
  }
};


module.exports = { createEmmbeddedPaymentLink, receivePayment };