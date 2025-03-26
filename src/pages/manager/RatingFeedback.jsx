import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStar, FaSort, FaEye, FaEyeSlash, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import SidebarManager from "./SidebarManager";

const RatingFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [filterRatings, setFilterRatings] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 Thêm state cho tìm kiếm

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    //Lấy danh sách feedback từ API
    try {
      const response = await fetch("/api/ratings");
      const data = await response.json();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
      setLoading(false);
    } catch {
      toast.error("Failed to load feedbacks");
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    // Hiển thị hoặc ẩn thông tin chi tiết về member và doctor
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterRatings = (Ratings) => {
    //Lọc feedback theo số sao.
    setFilterRatings(Ratings);
    setCurrentPage(1);
  };

  useEffect(() => {
    //Lọc danh sách theo số sao
    let filtered = feedbacks;
    if (filterRatings !== null) {
      filtered = feedbacks.filter((fb) => fb.Rating === filterRatings);
    }
    setFilteredFeedbacks(filtered);
  }, [filterRatings, feedbacks]);

  const sortFeedbacks = (type) => {
    // Sắp xếp feedback theo số sao hoặc ngày đánh giá.
    const sorted = [...filteredFeedbacks].sort((a, b) => {
      if (type === "Rating") {
        return sortOrder === "asc" ? a.Rating - b.Rating : b.Rating - a.Rating;
      } else {
        return sortOrder === "asc"
          ? new Date(a.CreatedDate) - new Date(b.CreatedDate)
          : new Date(b.CreatedDate) - new Date(a.CreatedDate);
      }
    });
    setFilteredFeedbacks(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // 🔹 Tìm kiếm feedback theo tên bác sĩ
  useEffect(() => {
    if (!searchTerm) {
      setFilteredFeedbacks(feedbacks);
    } else {
      const filtered = feedbacks.filter((fb) =>
        fb.DoctorId?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFeedbacks(filtered);
      setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    }
  }, [searchTerm, feedbacks]);

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const displayedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex">
      <SidebarManager />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Doctor Ratings & Feedback
        </h2>

        {/* Bộ lọc sao và sắp xếp */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {[5, 4, 3, 2, 1].map((Rating) => (
            <Button
              key={Rating}
              variant={filterRatings === Rating ? "default" : "outline"}
              className={`px-4 py-2 rounded-lg flex items-center font-semibold transition-all ${
                filterRatings === Rating
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() =>
                handleFilterRatings(filterRatings === Rating ? null : Rating)
              }
            >
              {Rating} <FaStar className="ml-1 text-yellow-500" />
            </Button>
          ))}
          <Button
            onClick={() => sortFeedbacks("CreatedDate")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Sort by CreatedDate <FaSort className="ml-2" />
          </Button>
          {/* 🔍 Tìm kiếm theo tên bác sĩ */}
          <div className="mb-6 flex items-center border rounded-lg p-3 bg-white shadow-md">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search feedback by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700 text-lg"
            />
          </div>
        </div>

        {/* Danh sách feedback */}
        {loading ? (
          <p className="text-center text-gray-500">Loading feedbacks...</p>
        ) : (
          displayedFeedbacks.map((fb) => (
            <Card
              key={fb._id}
              className="mb-4 bg-white shadow-lg rounded-xl transition-all hover:shadow-2xl"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold flex items-center text-yellow-600">
                      {fb.Rating} <FaStar className="text-yellow-500" />
                    </p>
                    <p className="text-gray-700 mt-2 italic">
                      Feedback: {fb.Feedback}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Date Feedback:{" "}
                      {new Date(fb.CreatedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => toggleExpand(fb._id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {expanded[fb.id] ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>

                {expanded[fb._id] && (
                  <div className="mt-4 border-t pt-3 text-gray-700">
                    <p>
                      <strong>👤 Member:</strong>{" "}
                      {fb.MemberId?.username || "Unknown"}
                    </p>
                    <p>
                      <strong>🩺 Doctor:</strong>{" "}
                      {fb.DoctorId?.username || "Unknown"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {/* Phân trang */}
        <div className="flex justify-center items-center mt-6 gap-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-lg font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingFeedback;
