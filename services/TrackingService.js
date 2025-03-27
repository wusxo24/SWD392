const Record = require ("../models/Record.js");

const Tracking = require("../models/Tracking.js");
const Child = require("../models/Children.js");
const fs = require("fs");

// Load the extracted LMS data from WHO
const path = require("path");
const bmiReference5_19 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "bmi_zscore5-19.json"), "utf8"));
const bmiReference0_2 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "bmi_zscore_0-2.json"), "utf8"));
const bmiReference2_5 = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "bmi_zscore_2-5.json"), "utf8"));
const lengthForAgeBoys = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "boy_length_for_age.json"), "utf8"));
const lengthForAgeGirls = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "girl_length_for_age.json"), "utf8"));
const headCircBoys = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "boy_head_for_age.json"), "utf8"));
const headCircGirls = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "girl_head_for_age.json"), "utf8"));
const weightForAgeBoys = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "boy_weight_for_age.json"), "utf8"));
const weightForAgeGirls = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "girl_weight_for_age.json"), "utf8"));
const boyWeightForLength = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "boy_weight_for_length.json"), "utf8"));
const girlWeightForLength = JSON.parse(fs.readFileSync(path.join(process.cwd(), "utils", "girl_weight_for_length.json"), "utf8"));

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
    console.log("BMI:", growthStats.BMI, "Z-score:", growthStats.BMIZScore, "BMI Result:", growthStats.BMIResult);

    // Calculate Length-for-Age Z-score
    if (growthStats.Height) {
        growthStats.LengthForAgeZScore = calculateLengthForAgeZScore(growthStats.Height, childAgeMonths, gender);
    }
    console.log("Length-for-Age Z-score:", growthStats.LengthForAgeZScore);

    // Calculate Head-circumference Z-score
    if (growthStats.HeadCircumference) {
        growthStats.HeadCircumferenceZScore = calculateHeadCircumferenceForAgeZScore(growthStats.HeadCircumference, childAgeMonths, gender);
    }
    console.log("Head-circumference Z-score:", growthStats.HeadCircumferenceZScore);
    // Calculate Weight-for-Age Z-score
    if (growthStats.Weight) {
        growthStats.WeightForAgeZScore = calculateWeightForAgeZScore(growthStats.Weight, childAgeMonths, gender);
    }
    console.log("Weight-for-Age Z-score:", growthStats.WeightForAgeZScore);

    // Calculate Weight-for-Length Z-score
    if (growthStats.Height && growthStats.Weight) {
        growthStats.WeightForLengthZScore = calculateWeightForLengthZScore(
            growthStats.Weight,
            growthStats.Height,
            gender
        );
    }
    console.log("Weight-for-Length Z-score:", growthStats.WeightForLengthZScore);

    if (growthStats.LengthForAgeZScore !== undefined) {
        growthStats.LengthForAgeResult = getLengthForAgeResult(growthStats.LengthForAgeZScore);
    }
    
    if (growthStats.WeightForAgeZScore !== undefined) {
        growthStats.WeightForAgeResult = getWeightForAgeResult(growthStats.WeightForAgeZScore);
    }
    
    if (growthStats.WeightForLengthZScore !== undefined) {
        growthStats.WeightForLengthResult = getWeightForLengthResult(growthStats.WeightForLengthZScore);
    }
    
    if (growthStats.HeadCircumferenceZScore !== undefined) {
        growthStats.HeadCircumferenceResult = getHeadCircumferenceResult(growthStats.HeadCircumferenceZScore);
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
// get months
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
    } else if (ageInMonths < 61) {
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

const calculateLengthForAgeZScore = (height, ageInMonths, gender) => {
    const referenceData = gender === "boys" ? lengthForAgeBoys : lengthForAgeGirls;
    const data = referenceData.find(entry => entry.Month === ageInMonths);

    if (!data) {
        console.error(`No reference data found for age (months): ${ageInMonths}`);
        return null;
    }

    const { L, M, S } = data;
    return parseFloat(((Math.pow(height / M, L) - 1) / (L * S)).toFixed(2));
};
const getLengthForAgeResult = (zScore) => {
    if (zScore === null) return "Unknown";
    if (zScore < -3) return "Severe Stunting";
    if (zScore < -2) return "Moderate Stunting";
    if (zScore >= -2) return "Normal";
    // Some systems also include "Tall" for zScore > 2 or zScore > 3
  };
const calculateHeadCircumferenceForAgeZScore = (headCircumference, ageInMonths, gender) => {
    const referenceData = gender === "boys" ? headCircBoys : headCircGirls;
    const lmsEntry = referenceData.find(entry => entry.Month === ageInMonths);

    if (!lmsEntry) {
        console.error(`No reference data found for age (months): ${ageInMonths}`);
        return null;
    }

    const { L, M, S } = lmsEntry;
    const zScore = ((Math.pow(headCircumference / M, L) - 1) / (L * S)).toFixed(2);
    return parseFloat(zScore);
}
const getHeadCircumferenceResult = (zScore) => {
    if (zScore === null) return "Unknown";
    if (zScore < -3) return "Severely Small Head Circumference";
    if (zScore < -2) return "Moderately Small Head Circumference";
    if (zScore >= -2 && zScore <= 2) return "Normal Head Circumference";
    if (zScore > 2) return "Large Head Circumference";
    if (zScore > 3) return "Severely Large Head Circumference";
  };

const calculateWeightForAgeZScore = (weight, ageInMonths, gender) => {
    const referenceData = gender === "boys" ? weightForAgeBoys : weightForAgeGirls;
    const data = referenceData.find(entry => entry.Month === ageInMonths);

    if (!data) {
        console.error(`No reference data found for age (months): ${ageInMonths}`);
        return null;
    }

    const { L, M, S } = data;
    return parseFloat(((Math.pow(weight / M, L) - 1) / (L * S)).toFixed(2));
};
const getWeightForAgeResult = (zScore) => {
    if (zScore === null) return "Unknown";
    if (zScore < -3) return "Severe Underweight";
    if (zScore < -2) return "Moderate Underweight";
    if (zScore < 2) return "Normal Weight";
    if (zScore >= 2) return "Above Normal Weight";
  };
const calculateWeightForLengthZScore = (weight, length, gender) => {
    const referenceData = gender === "boys" ? boyWeightForLength : girlWeightForLength;
    const closestEntry = referenceData.reduce((prev, curr) => 
        Math.abs(curr.Length - length) < Math.abs(prev.Length - length) ? curr : prev
    );

    if (!closestEntry) {
        console.error(`No reference data found for length: ${length}`);
        return null;
    }

    const { L, M, S } = closestEntry;
    const zScore = ((Math.pow(weight / M, L) - 1) / (L * S)).toFixed(2);
    return parseFloat(zScore);
};
const getWeightForLengthResult = (zScore) => {
    if (zScore === null) return "Unknown";
    if (zScore < -3) return "Severe Wasting";
    if (zScore < -2) return "Moderate Wasting";
    if (zScore < 1) return "Normal";
    if (zScore < 2) return "Risk of Overweight";
    if (zScore < 3) return "Overweight";
    return "Obesity";
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
