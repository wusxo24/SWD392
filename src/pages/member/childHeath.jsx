import React from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
const ChildHealth = ({ isOpen, onClose, trackingData }) => {
  if (!isOpen) return null; // Don't render if closed

  // Helper function to handle empty values
  const formatValue = (value) => (value !== null && value !== undefined && value !== "" ? value : "N/A");

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50"
      onClick={onClose} // Close when clicking outside
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-[40rem] max-h-[80vh] overflow-y-auto relative z-50"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Child Health Information</h2>

        {trackingData.length > 0 ? (
          trackingData.map((entry, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-blue-600"><CalendarMonthIcon/> {entry.MonthYear}</h3>
              {Object.entries(entry.Trackings).map(([date, details]) => (
                <div key={date} className="mt-2 p-2 border-t">
                  <h4 className="font-semibold text-gray-700"><CalendarMonthIcon/> {date}</h4>
                  <ul className="list-disc ml-5 text-gray-600">
                    <li>Height: {formatValue(details.Height)} cm</li>
                    <li>Weight: {formatValue(details.Weight)} kg</li>
                    <li>BMI: {formatValue(details.BMI)} ({formatValue(details.BMIResult)})</li>
                    <li>BMIZ Score: {formatValue(details.BMIZScore)}</li>
                    <li>Head Circumference: {formatValue(details.HeadCircumference)} cm</li>
                    <li>Waist: {formatValue(details.WaistCircumference)} cm</li>
                    <li>Hip: {formatValue(details.HipCircumference)} cm</li>
                    <li>Biceps: {formatValue(details.BicepsCircumference)} cm</li>
                    <li>Triceps: {formatValue(details.TricepsCircumference)} cm</li>
                    <li>Chest: {formatValue(details.ChestCircumference)} cm</li>
                    <li>Thigh: {formatValue(details.ThighCircumference)} cm</li>
                    <li>Calf: {formatValue(details.CalfCircumference)} cm</li>
                  </ul>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tracking data available.</p>
        )}
      </div>
    </div>
  );
};

export default ChildHealth;
