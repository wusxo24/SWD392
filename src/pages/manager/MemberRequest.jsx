import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { toast } from "react-hot-toast";

import SidebarManager from "./SidebarManager";

const MemberRequest = () => {
  const [requests, setRequests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({});

  useEffect(() => {
    fetchRequests();
    fetchDoctors();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/medical-requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
      toast.error("Failed to load requests");
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
      toast.error("Failed to load doctors");
    }
  };

  const handleAssign = async (requestId) => {
    if (!selectedDoctor[requestId]) {
      toast.error("Please select a doctor");
      return;
    }
    try {
      await axios.put(`/api/medical-requests/accept/${requestId}`, {
        DoctorId: selectedDoctor[requestId],
      });
      toast.success("Request assigned successfully");
      fetchRequests();
    } catch (error) {
      console.error("Error assigning request", error);
      toast.error("Error assigning request");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.put(`/api/medical-requests/reject/${requestId}`);
      toast.success("Request declined");
      fetchRequests();
    } catch (error) {
      console.error("Error declining request", error);
      toast.error("Error declining request");
    }
  };

  return (
    <div className="flex">
      <SidebarManager />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Member Requests</h2>
        {requests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
          requests.map((req) => (
            <Card key={req._id} className="mb-4">
              <CardContent>
                <p>
                  <strong>Member:</strong> {req.member?.name || "Unknown"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Reason:</strong> {req.reason || "No reason provided"}
                </p>
                <Select
                  onValueChange={(val) =>
                    setSelectedDoctor((prev) => ({ ...prev, [req._id]: val }))
                  }
                >
                  {doctors.length > 0 ? (
                    doctors.map((doc) => (
                      <SelectItem key={doc._id} value={doc._id}>
                        {doc.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="">No doctors available</SelectItem>
                  )}
                </Select>
                <div className="mt-2">
                  <Button
                    onClick={() => handleAssign(req._id)}
                    className="mr-2"
                  >
                    Assign
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDecline(req._id)}
                  >
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberRequest;
