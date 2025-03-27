import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaStar,
  FaSort,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarDoctor from "./SidebarDoctor";

const RatingandFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [averageRating, setAverageRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // 🔹 State tìm kiếm
  const feedbacksPerPage = 6; // 🔹 Số feedback hiển thị mỗi trang

  const doctorId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");
  console.log("Doctor ID:", doctorId);

  useEffect(() => {
    if (!doctorId) {
      toast.error("Doctor ID not found");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ratings");
        if (!response.ok) throw new Error("Failed to fetch ratings");

        const data = await response.json();
        console.log("Fetched Ratings:", data);

        const doctorFeedbacks = data.filter(
          (fb) => fb.DoctorId?.id === doctorId
        );
        setFeedbacks(doctorFeedbacks);

        if (doctorFeedbacks.length > 0) {
          const avg =
            doctorFeedbacks.reduce((sum, fb) => sum + fb.Rating, 0) /
            doctorFeedbacks.length;
          setAverageRating(avg.toFixed(1));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load feedbacks");
      }
      setLoading(false);
    };

    fetchData();
  }, [doctorId]);

  const sortFeedbacks = () => {
    setFeedbacks((prev) =>
      [...prev].sort((a, b) =>
        sortOrder === "asc" ? a.Rating - b.Rating : b.Rating - a.Rating
      )
    );
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // 🔎 Bộ lọc tìm kiếm
  const filteredFeedbacks = feedbacks.filter((fb) =>
    fb.MemberId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📌 Tính toán dữ liệu cho phân trang
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDoctor />
      <div className="p-8 w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ⭐ My Ratings & Feedback
        </h2>

        {/* 📊 Thông Tin Tổng Quan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-3 shadow-md rounded-lg text-center">
            <p className="text-lg font-semibold">Average Rating</p>
            <p className="text-3xl text-yellow-500 font-bold mt-2">
              {averageRating}
            </p>
            <p className="text-gray-500 text-sm">{feedbacks.length} ratings</p>
          </div>

          <div className="bg-white p-3 shadow-md rounded-lg flex justify-center">
            <button
              onClick={sortFeedbacks}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              Sort by Rating <FaSort className="ml-2" />
            </button>
          </div>

          {/* 🔍 Ô Tìm Kiếm */}
          <div className="bg-white p-3 shadow-md rounded-lg flex items-center">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by Member Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 outline-none bg-transparent"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading feedbacks...</p>
        ) : currentFeedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedbacks available</p>
        ) : (
          <div>
            {/* 📝 Danh Sách Feedbacks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFeedbacks.map((fb) => (
                <Card
                  key={fb._id}
                  className="bg-white shadow-md hover:shadow-lg transition-all transform hover:scale-90 rounded-xl p-3"
                >
                  <CardContent>
                    <div className="flex items-center mb-4">
                      {/* 📷 Avatar Member */}
                      {fb.MemberId?.picture ? (
                        <img
                          src={fb.MemberId.picture}
                          alt={fb.MemberId.username}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300 hover:border-blue-400 transition-all"
                        />
                      ) : (
                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                      )}
                      <div className="ml-3">
                        <p className="text-lg font-semibold">
                          {fb.MemberId?.username || "Anonymous"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(fb.CreatedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* ⭐ Rating */}
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-lg font-bold flex items-center ${
                          fb.Rating >= 4
                            ? "text-yellow-500"
                            : fb.Rating < 3
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        {fb.Rating} <FaStar className="ml-1" />
                      </p>
                    </div>
                    {/* 💬 Nội Dung Feedback */}
                    <p className="text-gray-700 mt-3 italic">{fb.Feedback}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ⏩ Phân Trang */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-white ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <FaChevronLeft />
              </button>

              <span className="text-lg font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-white ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingandFeedback;
