import { useState } from "react";

const TrackingSection = ({ trackingInfo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("MonthYear");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;

  // Filter based on search term
  const filteredTracking = trackingInfo.filter((tracking) =>
    tracking.MonthYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort function
  const sortedTracking = [...filteredTracking].sort((a, b) => {
    const valueA = a.Trackings[Object.keys(a.Trackings)[0]][sortField] || 0;
    const valueB = b.Trackings[Object.keys(b.Trackings)[0]][sortField] || 0;
    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedTracking.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(sortedTracking.length / recordsPerPage);

  return (
    <div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by month/year..."
        className="p-2 border rounded-md w-full mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Sorting Dropdown */}
      <div className="flex justify-between mb-3">
        <select
          className="p-2 border rounded-md"
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
        >
          <option value="MonthYear">Sort by Month</option>
          <option value="Height">Sort by Height</option>
          <option value="Weight">Sort by Weight</option>
          <option value="BMI">Sort by BMI</option>
        </select>
        <button
          className="p-2 border rounded-md bg-yellow-400 text-white"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
        </button>
      </div>

      {/* Tracking Data */}
      {currentRecords.length > 0 ? (
        currentRecords.map((tracking, i) => (
          <div key={i} className="mt-2 p-3 border rounded-md bg-gray-50 dark:bg-yellow-50">
            <h2 className="text-lg font-semibold text-yellow-700">
              Timeline: {tracking.MonthYear}
            </h2>
            {Object.entries(tracking.Trackings).map(([date, details]) => (
              <div key={date} className="mb-2 p-2 border-l-4 border-yellow-400 pl-4">
                <p><strong>📅 Date:</strong> {date}</p>
                <p><strong>📏 Height:</strong> {details.Height} cm</p>
                <p><strong>⚖️ Weight:</strong> {details.Weight} kg</p>
                <p><strong>📊 BMI:</strong> {details.BMI}</p>
                <p><strong>📈 BMI Z-Score:</strong> {details.BMIZScore}</p>
                <p><strong>📌 BMI Result:</strong> {details.BMIResult}</p>
                <p><strong>🎩 Head Circumference:</strong> {details.HeadCircumference} cm</p>
                <p><strong>👖 Waist Circumference:</strong> {details.WaistCircumference} cm</p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No tracking information available.</p>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          className="p-2 border rounded-md bg-orange-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 border rounded-md bg-orange-300"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default TrackingSection;
