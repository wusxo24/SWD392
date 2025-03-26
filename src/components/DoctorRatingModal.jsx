import { useState } from "react";
import axios from "../utils/axiosInstance";

const DoctorRatingModal = ({ isOpen, onClose, medicalRequestId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitRating = async () => {
        if (!medicalRequestId) return;
        setLoading(true);
        console.log("Medical Request ID:", medicalRequestId);
        console.log("Submitting rating:", rating, feedback, isAnonymous);
        try {
            await axios.post(`/api/doctor-ratings/${medicalRequestId}`, {
                Rating: rating,
                Feedback: feedback,
                IsAnonymous: isAnonymous,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-xl font-semibold">Rate & Provide Feedback</h3>
                <div className="mt-4">
                    <label className="block text-gray-700">Rating:</label>
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>{star} Stars</option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700">Feedback:</label>
                    <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
                <div className="mt-4 flex items-center">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                    />
                    <label className="ml-2 text-gray-700">Submit as Anonymous</label>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        onClick={submitRating}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorRatingModal;
