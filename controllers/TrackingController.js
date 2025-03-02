const Record = require("../models/Record");
const Tracking = require("../models/Tracking");

const updateTracking = async (req, res) => {
    try {
        const { recordId, date, growthStats } = req.body;
        const existingRecord = await Record.findById(recordId);
        if (!existingRecord) {
            return res.status(404).json({ error: "Record not found" });
        }
        if (existingRecord.Status !== "Activated") {
            return res.status(400).json({ error: "Record is not activated" });
        }
        const monthYear = date.substring(0, 7);

        // Check if the tracking group already exists
        let tracking = await Tracking.findOneAndUpdate(
            { RecordId: recordId, MonthYear: monthYear },
            { $set: { [`Trackings.${date}`]: growthStats } }, // Atomic update
            { new: true, upsert: true } // Creates if doesn't exist
        );

        return res.status(201).json({
            success: true,
            data: tracking,
            message: "Tracking data saved successfully"
        });

    } catch (error) {
        console.error("Error creating tracking:", error);
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
        const trackings = await Tracking.find({ RecordId: recordId });
        return res.status(200).json(trackings);
    } catch (error) {
        console.error("Error getting trackings:", error);
        return res.status(500).json({
            success: false,
            message: "Error getting trackings",
            error: error.message
        });
    }
}
module.exports = { updateTracking, getAllTrackingsByRecordId };

  
