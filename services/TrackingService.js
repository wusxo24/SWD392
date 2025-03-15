const Record = require("../models/Record");
const Tracking = require("../models/Tracking");
const Child = require("../models/Children");
const updateTracking = async (recordId, date, growthStats) => {
    const existingRecord = await Record.findById(recordId);
    if (!existingRecord) {
        throw new Error("Record not found");
    }
    if (existingRecord.Status !== "Activated") {
        throw new Error("Record is not activated");
    }
    const monthYear = date.substring(0, 7);

    // Check if the tracking group already exists
    let tracking = await Tracking.findOneAndUpdate(
        { RecordId: recordId, MonthYear: monthYear },
        { $set: { [`Trackings.${date}`]: growthStats } }, // Atomic update
        { new: true, upsert: true } // Creates if doesn't exist
    );

    return tracking;
};

const getAllTrackingsByRecordId = async (recordId) => {
    const trackings = await Tracking.find({ RecordId: recordId });
    if (!trackings.length) {
        throw new Error("No tracking records found for this record");
    }
    return trackings;
};

const getChildByRecordId = async (recordId) => {
    const record = await Record.findById(recordId);
    if (!record) {
        throw new Error("Record not found");
    }
    const child = await Child.findById(record.ChildId);
    return child;
}

const getTrackingsByRecordIdWithStartAndEndDates = async (recordId, startDate, endDate) => {
    const trackings = await Tracking.find({ RecordId: recordId, MonthYear: { $gte: startDate, $lte: endDate } });
    if (!trackings.length) {
        throw new Error("No tracking records found for this record");
    }
    return trackings;
}
module.exports = { updateTracking, getAllTrackingsByRecordId, getChildByRecordId, getTrackingsByRecordIdWithStartAndEndDates };