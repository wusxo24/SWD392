const Record = require("../models/Record");
const Order = require("../models/Order");
const Service = require("../models/Service");


const createRecord = async (req, res) => {
    try {
        const { OrderId} = req.body;

        const record = await Record.create({ OrderId });
        
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const activateRecord = async (req, res) => {
    try {
        const { recordId, childId} = req.body;

        // Check if the child is already associated with another activated record
        const existingActiveRecord = await Record.findOne({
            ChildId: childId,
            Status: "Activated",
            _id: { $ne: recordId }
        });
        
        if (existingActiveRecord) {
            return res.status(409).json({ 
                error: "This child is already associated with another activated record"
            });
        }


        const existingRecord = await Record.findById(recordId);
        
        if (!existingRecord) {
            return res.status(404).json({ error: "Record not found" });
        }
        
        const order = await Order.findById(existingRecord.OrderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        const service = await Service.findById(order.serviceId);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        const months = service.duration;

        // Calculate expiredDate by adding months to current date
        const currentDate = new Date();
        const expiredDate = new Date(currentDate);
        expiredDate.setMonth(currentDate.getMonth() + months);
        


        const updatedRecord = await Record.findByIdAndUpdate(
            recordId, 
            { 
                ChildId: childId, 
                Status: "Activated",
                ExpiredDate: expiredDate 
            }, 
            { new: true }
        );
        
        if (!updatedRecord) {
            return res.status(404).json({ error: "Record not found" });
        }
        
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deativateRecord = async (req, res) => {
    try {
        const { recordId } = req.body;
        
        const record = await Record.findByIdAndUpdate(recordId, { Status: "Inactivated" }, { new: true });
        
        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }
        
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRecordsByMemberId = async (req, res) => {
    try {
        const memberId = req.user.id;

        const memberOrders = await Order.find({ memberId });
        if (!memberOrders || memberOrders.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'No orders found for this member'
            });
          }

        const orderIds = memberOrders.map(order => order._id);

        const records = await Record.find({ OrderId: { $in: orderIds } })
            .populate('OrderId')            
        return res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { createRecord, activateRecord, deativateRecord, getRecordsByMemberId };