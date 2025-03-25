import React, { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { postTracking } from "@/services/tracking";
import { toast } from "react-toastify";
import { getDoctorResponse } from "@/services/medicalRequestService"; // Import the service


const ChildHealth = ({ isOpen, onClose, trackingData, setTrackingData, medicalRequests }) => {
  const [editingDates, setEditingDates] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [activeTab, setActiveTab] = useState("tracking"); 
  const [selectedMonth, setSelectedMonth] = useState("");
  const [doctorResponses, setDoctorResponses] = useState({});
  if (!isOpen) return null;

  const fetchDoctorResponse = async (medicalRequestId) => {
    try {
      const data = await getDoctorResponse(medicalRequestId);
      setDoctorResponses((prev) => ({ ...prev, [medicalRequestId]: data }));
    } catch (error) {
      console.error("Failed to fetch doctor response:", error);
    }
  };

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

  // Handle dropdown selection
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Filter tracking data based on selected month
  const filteredTrackingData = selectedMonth
    ? trackingData.filter((entry) => entry.MonthYear === selectedMonth)
    : trackingData;
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
  const medicalRequestsArray = Array.isArray(medicalRequests) ? medicalRequests : [medicalRequests];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[45rem] max-h-[80vh] overflow-y-auto relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Child Health Information</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab == "tracking"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Tracking Data
            </button>
            <button
              onClick={() => setActiveTab("medical")}
              className={`px-4 py-2 rounded-lg transition cursor-pointer ${
                activeTab == "medical"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Medical Requests
            </button>
          </div>
        </div>

        {activeTab == "tracking" && (
          <>
          <div className="mb-4 ">
              <label className="font-semibold text-gray-700 ">Select Month:</label>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="ml-2 p-2 border rounded-lg cursor-pointer"
              >
                <option value="">All Months</option>
                {[...new Set(trackingData.map((entry) => entry.MonthYear))].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            {filteredTrackingData.length > 0 ? (
              filteredTrackingData.map((entry, index) => (
                <div key={index} className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold text-blue-600">
                    <CalendarMonthIcon /> {entry.MonthYear}
                  </h3>
                  {Object.entries(entry.Trackings)
                    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // Sort dates in descending order
                    .map(([date, details]) => (
                      <div key={date} className="mt-2 p-2 border-t">
                        <h4 className="font-semibold text-gray-700">
                          <CalendarMonthIcon /> {date}
                        </h4>
                        <ul className="list-disc ml-5 text-gray-600">
                          {allFields.map((key) => (
                            <li key={key} className="flex items-center space-x-2">
                              <span className="w-40 text-gray-600">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
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


          {activeTab === "medical" && (
            <>
            {medicalRequestsArray.length > 0 ? (
          medicalRequestsArray.map((request, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold">
                Status:{" "}
                <span className={`text-lg font-semibold ${
                  request.Status === "Pending"
                    ? "text-yellow-500"
                    : request.Status === "Completed"
                    ? "text-green-500"
                    : request.Status === "Rejected"
                    ? "text-red-500"
                    : request.Status === "InProgress"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}>
                  {request.Status}
                </span>
              </h3>
              <p className="text-gray-700">
                <strong>Request Reason:</strong> {request.Reason}
              </p>
              <p className="text-gray-700">
                <strong>Notes:</strong> {request.Notes}
              </p>

             {request.Status === "Completed" && (
                <>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700"
                    onClick={() => fetchDoctorResponse(request._id)}
                  >
                    Show Doctor's Response
                  </button>
                  {doctorResponses[request._id] && (
                    <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold text-gray-800">Doctor's Response:</h4>
                      <div className="mt-2 space-y-2">
                      <p><strong className="text-gray-700">Diagnosis:</strong> {doctorResponses[request._id].Diagnosis}</p>
                      <p><strong className="text-gray-700">Recommendations:</strong> {doctorResponses[request._id].Recommendations}</p>
                      <p><strong className="text-gray-700">Additional Notes:</strong> {doctorResponses[request._id].AdditionalNotes}</p>
                      </div>
                      <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                        onClick={() => setDoctorResponses((prev) => ({ ...prev, [request._id]: null }))}
                      >
                        Close Response
                      </button>
                    </div>
                  )} 
                </>
              )}
            </div>
          ))
        ) : (
          <p>No medical requests found.</p>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChildHealth;
