import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

import SidebarDoctor from "./SidebarDoctor";
const AnalyzeReport = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [report, setReport] = useState("");

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get(`/api/medical-requests/${requestId}`);
        setRequest(response.data);
      } catch (error) {
        console.error("Error fetching request details", error);
      }
    };
    fetchRequestDetails();
  }, [requestId]);

  const handleSubmitReport = async () => {
    try {
      await axios.post(
        `/api/doctor-responses`,
        { requestId, response: report },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Report submitted successfully");
      navigate("/doctor/view-requests");
    } catch (error) {
      console.error("Error submitting report", error);
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="flex">
      <SidebarDoctor />
      <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Analyze Medical Request</h2>
        <p>
          <strong>Member:</strong> {request.memberName}
        </p>
        <p>
          <strong>Reason:</strong> {request.reason}
        </p>
        <p>
          <strong>Notes:</strong> {request.notes}
        </p>

        <Textarea
          className="w-full mt-4 border p-2 rounded"
          placeholder="Enter your analysis and recommendations"
          value={report}
          onChange={(e) => setReport(e.target.value)}
        />

        <Button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmitReport}
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
};

export default AnalyzeReport;
