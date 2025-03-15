const TrackingService = require("../services/TrackingService");

const updateTracking = async (req, res) => {
    try {
        const { recordId, date, growthStats } = req.body;
        const tracking = await TrackingService.updateTracking(recordId, date, growthStats);
        return res.status(201).json({
            success: true,
            data: tracking,
            message: "Tracking data saved successfully"
        });
    } catch (error) {
        console.error("Error creating tracking:", error);
        if (error.message === "Record not found" || error.message === "Record is not activated") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({
            success: false,
            message: "Error creating tracking",
            error: error.message
        });
    }
};

const getAllTrackingsByRecordId = async (req, res) => {
    try {
        const { recordId } = req.body;
        const trackings = await TrackingService.getAllTrackingsByRecordId(recordId);
        return res.status(200).json(trackings);
    } catch (error) {
        console.error("Error getting trackings:", error);
        if (error.message === "No tracking records found for this record") {
            return res.status(404).json({ success: false, message: error.message });
        }
        return res.status(500).json({
            success: false,
            message: "Error getting trackings",
            error: error.message
        });
    }
};

const getChildByRecordId = async (req, res) => {
    try {
        const { recordId } = req.params;
        const child = await TrackingService.getChildByRecordId(recordId);
        return res.status(200).json(child);
    } catch (error) {
        console.error("Error getting child:", error);
        if (error.message === "Record not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        return res.status(500).json({
            success: false,
            message: "Error getting child",
            error: error.message
        });
    }
};

const getTrackingsByRecordIdWithStartAndEndDates = async (req, res) => {
    try {
        const { recordId, startDate, endDate } = req.body;
        const trackings = await TrackingService.getTrackingsByRecordIdWithStartAndEndDates(recordId, startDate, endDate);
        return res.status(200).json(trackings);
    } catch (error) {
        console.error("Error getting trackings:", error);
        if (error.message === "No tracking records found for this record") {
            return res.status(404).json({ success: false, message: error.message });
        }
        return res.status(500).json({
            success: false,
            message: "Error getting trackings",
            error: error.message
        });
    }
}
module.exports = { updateTracking, getAllTrackingsByRecordId, getChildByRecordId, getTrackingsByRecordIdWithStartAndEndDates };