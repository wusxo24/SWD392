import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaStar,
  FaSort,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
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

  // const handleFilterRatings = (Ratings) => {
  //   //Lọc feedback theo số sao.
  //   setFilterRatings(Ratings);
  //   setCurrentPage(1);
  // };

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
    <div className="flex min-h-screen bg-gray-50">
      <SidebarManager />
      <div className="flex-1 max-w-6xl mx-auto p-6">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center tracking-wide">
          ⭐ Doctor Ratings & Feedback
        </h2>

        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="flex flex-wrap items-center justify-between mb-6 px-4">
          <div className="flex gap-3">
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
                  setFilterRatings(filterRatings === Rating ? null : Rating)
                }
              >
                {Rating} <FaStar className="ml-1 text-yellow-500" />
              </Button>
            ))}
          </div>

          <Button
            onClick={() => sortFeedbacks("CreatedDate")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Sort by CreatedDate <FaSort className="ml-2" />
          </Button>

          <div className="relative w-80">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search doctor feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
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
              className="mb-5 bg-white shadow-lg rounded-xl transition-all hover:shadow-2xl border border-gray-200"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {fb.MemberId?.picture ? (
                      <img
                        src={fb.MemberId.picture}
                        alt={fb.MemberId.username}
                        className="w-12 h-12 rounded-full border border-gray-300 shadow-sm object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-gray-400" />
                    )}
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {fb.MemberId?.username || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(fb.CreatedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-xl font-bold flex items-center text-yellow-500">
                    {fb.Rating} <FaStar className="ml-1" />
                  </p>
                </div>

                {/* Feedback */}
                <p className="text-gray-700 italic leading-relaxed">
                  Feedback: {fb.Feedback}
                </p>

                {/* Nút mở rộng */}
                <button
                  onClick={() => toggleExpand(fb._id)}
                  className="text-blue-500 hover:underline flex items-center text-sm"
                >
                  {expanded[fb._id] ? (
                    <>
                      Hide Details <FaEyeSlash className="ml-1" />
                    </>
                  ) : (
                    <>
                      Show Details <FaEye className="ml-1" />
                    </>
                  )}
                </button>

                {/* Chi tiết mở rộng */}
                {expanded[fb._id] && (
                  <div className="mt-4 border-t pt-3 text-gray-700 bg-gray-50 p-3 rounded-lg shadow-inner">
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
