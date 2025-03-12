const RecordService = require("../services/RecordService");

const createRecord = async (req, res) => {
    try {
        const { OrderId } = req.body;
        const record = await RecordService.createRecord(OrderId);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const activateRecord = async (req, res) => {
    try {
        const { recordId, childId } = req.body;
        const updatedRecord = await RecordService.activateRecord(recordId, childId);
        res.status(200).json(updatedRecord);
    } catch (error) {
        if (error.message === "This child is already associated with another activated record") {
            res.status(409).json({ error: error.message });
        } else if (error.message === "Record not found" || error.message === "Order not found" || error.message === "Service not found") {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const deactivateRecord = async (req, res) => {
    try {
        const { recordId } = req.body;
        const record = await RecordService.deactivateRecord(recordId);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRecordsByMemberId = async (req, res) => {
    try {
        const memberId = req.user.id;
        const records = await RecordService.getRecordsByMemberId(memberId);
        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        if (error.message === "No orders found for this member") {
            res.status(404).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { createRecord, activateRecord, deactivateRecord, getRecordsByMemberId };