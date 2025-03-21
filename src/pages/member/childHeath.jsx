import React, { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { postTracking } from "@/services/tracking";
import { toast } from "react-toastify";

const ChildHealth = ({ isOpen, onClose, trackingData, setTrackingData, medicalRequests }) => {
  const [editingDates, setEditingDates] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [activeTab, setActiveTab] = useState("tracking"); // ✅ Toggle state

  if (!isOpen) return null;

  const formatValue = (value) =>
    value !== null && value !== undefined && value !== "" ? value : "N/A";

  const bmiFields = ["BMI", "BMIZScore", "BMIResult"];
  const allFields = [
    "Height",
    "Weight",
    "BMI",
    "BMIZScore",
    "BMIResult",
    "HeadCircumference",
    "WaistCircumference",
    "HipCircumference",
    "BicepsCircumference",
    "TricepsCircumference",
    "ChestCircumference",
    "ThighCircumference",
    "CalfCircumference",
  ];

  const handleEditClick = (date, details) => {
    setEditingDates((prev) => ({ ...prev, [date]: true }));
    setEditedValues((prev) => ({
      ...prev,
      [date]: { ...details },
    }));
  };

  const handleInputChange = (date, field, value) => {
    if (bmiFields.includes(field)) return;
    setEditedValues((prev) => ({
      ...prev,
      [date]: { ...prev[date], [field]: value },
    }));
  };

  const handleSave = async (recordId, date) => {
    try {
      await postTracking(recordId, date, editedValues[date]);

      // ✅ Update UI immediately
      setTrackingData((prevData) =>
        prevData.map((entry) =>
          entry.RecordId === recordId
            ? {
                ...entry,
                Trackings: {
                  ...entry.Trackings,
                  [date]: { ...editedValues[date] },
                },
              }
            : entry
        )
      );

      toast.success("Tracking data updated successfully!");
      setEditingDates((prev) => ({ ...prev, [date]: false }));
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Error updating tracking data:", error);
    }
  };

  const handleCancel = (date) => {
    setEditingDates((prev) => ({ ...prev, [date]: false }));
    setEditedValues((prev) => {
      const newValues = { ...prev };
      delete newValues[date];
      return newValues;
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[45rem] max-h-[80vh] overflow-y-auto relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Child Health Information
        </h2>

        {/* ✅ Switch Buttons for Tracking & Medical Requests */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Child Health Information</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === "tracking"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Tracking Data
            </button>
            <button
              onClick={() => setActiveTab("medical")}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab === "medical"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Medical Requests
            </button>
          </div>
        </div>

        {/* ✅ Tracking Data Section */}
        {activeTab === "tracking" && (
          <>
            {trackingData.length > 0 ? (
              trackingData.map((entry, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    <CalendarMonthIcon /> {entry.MonthYear}
                  </h3>
                  {Object.entries(entry.Trackings).map(([date, details]) => (
                    <div key={date} className="mt-2 p-2 border-t">
                      <h4 className="font-semibold text-gray-700">
                        <CalendarMonthIcon /> {date}
                      </h4>
                      <ul className="list-disc ml-5 text-gray-600">
                        {allFields.map((key) => (
                          <li key={key} className="flex items-center space-x-2">
                            <span className="w-40 text-gray-600">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            {bmiFields.includes(key) ? (
                              <span className="font-semibold text-gray-800">
                                {formatValue(details[key])}
                              </span>
                            ) : editingDates[date] ? (
                              <input
                                type="number"
                                value={editedValues[date]?.[key] || ""}
                                onChange={(e) =>
                                  handleInputChange(date, key, e.target.value)
                                }
                                className="border px-2 py-1 rounded w-24"
                              />
                            ) : (
                              <span>{formatValue(details[key])}</span>
                            )}
                          </li>
                        ))}
                      </ul>

                      {/* ✅ Edit & Save Buttons */}
                      {editingDates[date] ? (
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => handleSave(entry.RecordId, date)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleCancel(date)}
                            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(date, details)}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tracking data available.</p>
            )}
          </>
        )}

        {/* ✅ Medical Requests Section */}
        {activeTab === "medical" && (
          <>
            {medicalRequests.length > 0 ? (
              medicalRequests.map((request, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    <CalendarMonthIcon /> {request.RequestDate}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Request Type:</strong> {request.RequestType}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong> {request.Status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No medical requests available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChildHealth;
