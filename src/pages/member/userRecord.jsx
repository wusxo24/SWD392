import React, { useEffect, useState } from "react";
import { getRecordsByMemberId as getUserRecords, activateRecord, deactivateRecord, getChildren } from "@/components/service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getPricingPlans } from "@/components/service";

export const UserRecord = () => {
  const [records, setRecords] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRecords();
    fetchPlans();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getUserRecords();
      setRecords(Array.isArray(data.data) ? data.data : []);
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
      const data = await getPricingPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const getPlanName = (orderId) => {
    const plan = plans.find((plan) => plan._id === orderId);
    return plan ? plan.name : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Still not active yet"; // Handle missing values
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const openChildSelectionModal = async (record) => {
    try {
      const data = await getChildren(); // Fetch children list
      setChildren(Array.isArray(data) ? data : []);
      console.log(data)
      setSelectedRecord(record);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    }
  };

  const handleSelectChild = async (childId) => {
    if (!selectedRecord) return;
  
    try {
      await activateRecord(selectedRecord._id, childId); // Pass both IDs
      fetchRecords(); // Refresh the records
      toast.success("Record activated successfully");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to activate record");
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
              <th className="border p-2">Expiration Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="border p-2">{getPlanName(record.OrderId?.serviceId)}</td>
                <td className="border p-2">{formatDate(record.ExpiredDate)}</td>
                <td className="border p-2">{record.Status}</td>
                <td className="border p-2">
                  {record.Status === "Inactivated" ? (
                    <button
                      className="bg-green-500 text-white px-2 py-1 mr-2 cursor-pointer rounded-lg"
                      onClick={() => openChildSelectionModal(record)}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 text-white px-2 py-1 cursor-pointer rounded-lg"
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

      {/* Child Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-3">Select a Child</h3>
            {children.length === 0 ? (
              <p>No children available.</p>
            ) : (
              <ul>
                {children.map((child) => (
                  <li
                    key={child._id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectChild(child._id)}
                  >
                    {child.fname} {child.lname}
                  </li>
                ))}
              </ul>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
