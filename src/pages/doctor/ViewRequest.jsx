import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

import SidebarDoctor from "./SidebarDoctor";

const API_URL = "https://swd-392-api.vercel.app/api/medical-requests/doctor";

export default function ViewRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId"); // Lấy doctorId từ localStorage

  useEffect(() => {
    async function fetchRequests() {
      if (!doctorId) {
        toast.error("Doctor ID not found. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/${doctorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests", error);
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [doctorId]);

  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Medical Requests Assigned to You
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests assigned.</p>
        ) : (
          requests.map((request) => (
            <Card
              key={request._id}
              className="mb-4 p-4 shadow-lg rounded-xl border border-gray-200"
            >
              <CardContent>
                <p className="text-gray-700">
                  <strong>Member NameName:</strong> {request.memberId}
                </p>
                <p className="text-gray-700">
                  <strong>Date:</strong>{" "}
                  {new Date(request.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Reason:</strong> {request.reason}
                </p>
                <Button
                  onClick={() => navigate(`/analyze-report/${request._id}`)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Reply
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
