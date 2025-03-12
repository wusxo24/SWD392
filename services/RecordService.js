const Record = require("../models/Record");
const Order = require("../models/Order");
const Service = require("../models/Service");

const createRecord = async (OrderId) => {
    const record = await Record.create({ OrderId });
    return record;
};

const activateRecord = async (recordId, childId) => {
    // Check if the child is already associated with another activated record
    const existingActiveRecord = await Record.findOne({
        ChildId: childId,
        Status: "Activated",
        _id: { $ne: recordId }
    });

    if (existingActiveRecord) {
        throw new Error("This child is already associated with another activated record");
    }

    const existingRecord = await Record.findById(recordId);
    if (!existingRecord) {
        throw new Error("Record not found");
    }

    const order = await Order.findById(existingRecord.OrderId);
    if (!order) {
        throw new Error("Order not found");
    }

    const service = await Service.findById(order.serviceId);
    if (!service) {
        throw new Error("Service not found");
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
        throw new Error("Record not found");
    }

    return updatedRecord;
};

const deactivateRecord = async (recordId) => {
    const record = await Record.findByIdAndUpdate(recordId, { Status: "Inactivated" }, { new: true });
    if (!record) {
        throw new Error("Record not found");
    }
    return record;
};

const getRecordsByMemberId = async (memberId) => {
    const memberOrders = await Order.find({ memberId });
    if (!memberOrders || memberOrders.length === 0) {
        throw new Error("No orders found for this member");
    }

    const orderIds = memberOrders.map(order => order._id);

    const records = await Record.find({ OrderId: { $in: orderIds } })
        .populate('OrderId');

    return records;
};

module.exports = { createRecord, activateRecord, deactivateRecord, getRecordsByMemberId };