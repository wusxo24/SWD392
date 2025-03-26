import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaStar, FaSort, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarDoctor from "./SidebarDoctor";

const RatingandFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [averageRating, setAverageRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 4; // 🔹 Số feedback hiển thị mỗi trang

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

  // 📌 Tính toán dữ liệu cho phân trang
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(
    indexOfFirstFeedback,
    indexOfLastFeedback
  );

  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="p-8 w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ⭐ My Ratings & Feedback
        </h2>

        <div className="flex justify-between items-center bg-gray-100 p-5 rounded-lg mb-6 shadow-md">
          <p className="text-xl font-semibold">
            Average Rating:{" "}
            <span className="text-yellow-500">{averageRating}</span>
          </p>
          <button
            onClick={sortFeedbacks}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            Sort by Rating <FaSort className="ml-2" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading feedbacks...</p>
        ) : currentFeedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedbacks available</p>
        ) : (
          <div>
            {/* 🔹 Danh sách phản hồi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFeedbacks.map((fb) => (
                <Card
                  key={fb._id}
                  className="bg-white shadow-lg rounded-xl p-6"
                >
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold flex items-center text-yellow-600">
                        {fb.Rating} <FaStar className="text-yellow-500 ml-1" />
                      </p>
                      <p className="text-gray-500 text-sm">
                        {new Date(fb.CreatedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700 mt-3 italic">
                      Feedback: `{fb.Feedback}`
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      By: {fb.MemberId?.username || "Anonymous"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 🔹 Phân trang */}
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
