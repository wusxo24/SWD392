import React, { useEffect, useState } from "react";
import { getRecordsByMemberId as getUserRecords, activateRecord, deactivateRecord } from "@/components/service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPricingPlans } from "@/components/service"; // Import the function to fetch plans

export const UserRecord = () => {
  const [records, setRecords] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
    fetchPlans();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getUserRecords();
      console.log("API Response:", data);

      // Extract records from 'data' field
      setRecords(Array.isArray(data.data) ? data.data : []);

      if (Array.isArray(data.data) && data.data.length > 0) {
        toast.success("Records loaded successfully");
      } else {
        toast.info("No records found");
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await getPricingPlans(); // Fetch available plans
      setPlans(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const getPlanName = (orderId) => {
    const plan = plans.find((plan) => plan._id === orderId);
    return plan ? plan.name : "N/A";
  };

  const handleActivate = async (id) => {
    try {
      await activateRecord(id);
      fetchRecords();
      toast.success("Record activated successfully");
    } catch {
      toast.error("Failed to activate record");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateRecord(id);
      fetchRecords();
      toast.success("Record deactivated successfully");
    } catch {
      toast.error("Failed to deactivate record");
    }
  };

  return (
    <div className="p-5 h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">User Records</h2>

      {loading ? (
        <p className="h-screen">Loading records...</p>
      ) : records === null || records.length === 0 ? (
        <p className="text-gray-500">No records available.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Plan Name</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="border p-2">{getPlanName(record.OrderId?.serviceId)}</td>
                <td className="border p-2">{record.Status}</td>
                <td className="border p-2">
                  {record.Status === "Inactivated" ? (
                    <button
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                      onClick={() => handleActivate(record._id)}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 text-white px-2 py-1"
                      onClick={() => handleDeactivate(record._id)}
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
