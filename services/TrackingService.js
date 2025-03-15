const Record = require("../models/Record");
const Tracking = require("../models/Tracking");
const Child = require("../models/Children");
const fs = require("fs");

// Load the extracted LMS data from WHO
const bmiReference5_19 = JSON.parse(fs.readFileSync("./utils/bmi_zscore5-19.json", "utf8"));
const bmiReference0_2 = JSON.parse(fs.readFileSync("./utils/bmi_zscore_0-2.json", "utf8"));
const bmiReference2_5 = JSON.parse(fs.readFileSync("./utils/bmi_zscore_2-5.json", "utf8"));

const updateTracking = async (recordId, date, growthStats) => {
    const existingRecord = await Record.findById(recordId);
    if (!existingRecord) {
        throw new Error("Record not found");
    }
    if (existingRecord.Status !== "Activated") {
        throw new Error("Record is not activated");
    }

    const monthYear = date.substring(0, 7);
    const child = await getChildByRecordId(recordId);
    if (!child) {
        throw new Error("Child not found");
    }

    const childAgeMonths = getAgeInMonths(child.birthdate); // Use months
    let gender = child.gender;
    // convert male to boy and female to girl
    if (gender === "Male") {
        gender = "boys";
    } else if (gender === "Female") {
        gender = "girls";
    }
    console.log("Looking up Z-score for:", gender, childAgeMonths);

    // Calculate BMI and Z-score
    if (growthStats.Height && growthStats.Weight) {
        growthStats.BMI = calculateBMI(growthStats.Height, growthStats.Weight);
        growthStats.BMIZScore = calculateBMIZScore(growthStats.BMI, childAgeMonths, gender);
        growthStats.BMIResult = getBMIResult(growthStats["BMIZ-score"]);
    }

    let tracking = await Tracking.findOneAndUpdate(
        { RecordId: recordId, MonthYear: monthYear },
        { $set: { [`Trackings.${date}`]: growthStats } },
        { new: true, upsert: true }
    );

    return tracking;
};


// BMI Calculation Function
const calculateBMI = (height, weight) => {
    if (height <= 0 || weight <= 0) return null;
    return (weight / Math.pow(height / 100, 2)).toFixed(2); // Convert cm to meters
};
// Convert to total months
const getAgeInMonths = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const now = new Date();

    const years = now.getFullYear() - birthDateObj.getFullYear();
    const months = now.getMonth() - birthDateObj.getMonth();

    return years * 12 + months; 
};

// Get BMI Result
const getBMIResult = (zScore) => {
    if (zScore === null) return "Unknown";
    if (zScore < -3) return "Severe Thinness";
    if (zScore < -2) return "Moderate Thinness";
    if (zScore < 1) return "Normal Weight";
    if (zScore < 2) return "Overweight";
    return "Obesity";
};


//BMI Z-score Calculation
const calculateBMIZScore = (bmi, ageInMonths, gender) => {
    let bmiReference = null;
    if (ageInMonths < 24) {
        bmiReference = bmiReference0_2;
    } else if (ageInMonths < 60) {
        bmiReference = bmiReference2_5;
    } else {
        bmiReference = bmiReference5_19;
    }
    
    if (!bmiReference[gender]) {
        console.error(`Error: No BMI reference for gender: ${gender}`);
        return null;
    }
    

    const data = bmiReference[gender][ageInMonths]; // Lookup by months
    if (!data) {
        console.error(`Error: No BMI reference for age (months): ${ageInMonths}`);
        return null;
    }

    const { L, M, S } = data;
    return parseFloat(((Math.pow((bmi / M), L) - 1) / (L * S)).toFixed(2));
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