import { useEffect, useState } from "react";
import SidebarManager from "./SidebarManager";
import { getDoctorRating } from "@/services/doctorService";

const RatingFeedback = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getDoctorRating(); // Call your existing function
        setRatings(data);
      } catch (err) {
        setError("Failed to fetch ratings.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="flex">
      <SidebarManager />
      <div className="p-4 w-full">
        <h2 className="text-xl font-semibold mb-4">Doctor Ratings</h2>

        {loading && <p>Loading ratings...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <div key={rating._id} className="p-4 border rounded-lg shadow">
                <p><strong>Rating:</strong> ⭐ {rating.Rating}/5</p>
                {rating.Feedback && <p><strong>Feedback:</strong> {rating.Feedback}</p>}
                <p className="text-sm text-gray-500">
                 Anonymous
                </p>
                <p className="text-xs text-gray-400">Date: {new Date(rating.CreatedDate).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            !loading && <p>No ratings available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingFeedback;
