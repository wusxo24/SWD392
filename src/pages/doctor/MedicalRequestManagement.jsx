import { useEffect, useState } from "react";
import TrackingSection from "@/components/TrackingSection";
import DoctorResponseModal from "@/components/DoctorResponseModal";
import { fetchAllChildren } from "@/services/childService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { getApprovedRequestsByDoctorId } from "@/services/medicalRequestService";
import SidebarDoctor from "./SidebarDoctor";
import { FaUser, FaClipboardList, FaChild, FaChevronDown, FaChevronUp, FaSort ,FaChartLine  } from "react-icons/fa";

export default function ViewRequest() {
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  const handleOpenModal = (requestId) => {
    setSelectedRequestId(requestId); // ✅ Store the selected request ID
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

    const fetchChildren = async () => {
      try {
        const data = await fetchAllChildren();
        setChildren(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching children:", error);
        toast.error("Failed to load children");
      }
    };

   const getChildAgeInMonths = (childId) => {
      console.log(childId);
      console.log(children);
      const child = children.find((c) => c._id === childId);
      console.log("Child Data:", child); // Debugging log
    
      if (!child) {
        console.error("Child not found for ID:", childId);
        return null;
      }
      if (!child.birthdate) {  // Use birthdate instead of DOB
        console.error("Child birthdate is missing for:", child);
        return null;
      }
    
      const birthDate = new Date(child.birthdate); // Correct field
      const today = new Date();
      const ageInMonths =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());
    
      return ageInMonths;
    };
    const handleRedirect = (record) => {
      if (!record.ChildId) return;
    
      const ageInMonths = getChildAgeInMonths(record.ChildId._id);
      if (ageInMonths === null) {
        toast.error("Child's date of birth is missing.");
        return;
      }
    
      if (ageInMonths <= 36) {
        window.location.href = `/childGrowthBabyDoctor/${record._id}`;
      } else if (ageInMonths >= 36 && ageInMonths <= 240) {
        window.location.href = `/childGrowthDoctor/${record._id}`;
      } else {
        toast.error("Child's age is out of the valid range.");
      }
    };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getApprovedRequestsByDoctorId();
        setRequests(data || []);
        setFilteredRequests(data || []);
      } catch (error) {
        toast.error("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter((request) =>
      request.Reason?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset pagination when searching
  }, [searchQuery, requests]);
  
  

  const toggleExpand = (id, section) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [section]: !prev[id]?.[section],
      },
    }));
  };

  const sortRequests = () => {
    const sorted = [...filteredRequests].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.CreatedDate) - new Date(b.CreatedDate)
        : new Date(b.CreatedDate) - new Date(a.CreatedDate)
    );
    setFilteredRequests(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex bg-gray-50 light:bg-gray-900 min-h-screen">
      <SidebarDoctor />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 light:text-gray-200 mb-8">
          Approved Medical Requests
          </h1>

          {/* Search & Sorting */}
          <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={sortRequests}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg transition-all 
                      hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 active:scale-95"
          >
            <FaSort /> Sort by Date
          </Button>
        </div>

     {/* Data Rendering */}
     {loading ? (
          <p className="text-gray-500 light:text-gray-400">Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-gray-500 light:text-gray-400">No approved requests assigned.</p>
        ) : (
          displayedRequests.map((request) => (
            <Card
              key={request._id}
              className="mb-6 bg-white/90 light:bg-gray-800/90 shadow-lg rounded-2xl border border-gray-300 light:border-gray-700 backdrop-blur-lg"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                  <h3 className="text-gray-700 light:text-gray-300 text-lg font-semibold">Medical Request: {request._id}</h3>
                    <p className="text-gray-600 light:text-gray-400">
                      <strong>Date:</strong> {new Date(request.CreatedDate).toLocaleString()}
                    </p>
                    <p className="text-gray-600 light:text-gray-400">
                      <strong>Reason:</strong> {request.Reason || "No reason provided"}
                    </p>
                    <p className="text-gray-600 light:text-gray-400">
                      <strong>Notes:</strong> {request.Notes || "No notes provided"}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <button 
                      onClick={() => handleRedirect(request.RecordId)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
                    >
                      Analyze
                    </button>

                    <button 
                      onClick={() => handleOpenModal(request._id)}
                      className="bg-green-500 hover:scale-105 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>

              {/* Toggle Buttons */}
              <div className="mt-4 flex space-x-3">
                {["record", "member", "child", "tracking"].map((section) => {
                  const isExpanded = expanded[request._id]?.[section] || false; // Ensure it doesn't break when undefined
                  const sectionStyles = {
                    record: "bg-gray-600 hover:bg-gray-700 text-white",
                    member: "bg-blue-500 hover:bg-blue-600 text-white",
                    child: "bg-green-500 hover:bg-green-600 text-white",
                    tracking: "bg-yellow-500 hover:bg-yellow-600 text-white",
                  };

                  return (
                    <Button
                      key={section}
                      onClick={() => toggleExpand(request._id, section)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow transition-transform transform hover:scale-105 ${sectionStyles[section]}`}
                      aria-expanded={isExpanded}
                    >
                      {section === "record" ? (
                        <FaClipboardList />
                      ) : section === "member" ? (
                        <FaUser />
                      ) : section === "child" ? (
                        <FaChild />
                      ) : (
                        <FaChartLine />
                      )}
                      <span>{isExpanded ? `Hide ${section}` : `Show ${section}`}</span>
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </Button>
                  );
                })}
              </div>

              {/* Animated Details Section */}
              {["record", "member", "child", "tracking"].map((section, index) => (
                expanded[request._id]?.[section] && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-4 p-4 rounded-lg shadow-md ${
                      section === "record"
                        ? "bg-gray-100 border-l-4 border-gray-400 light:bg-gray-700 light:border-gray-600"
                        : section === "member"
                        ? "bg-blue-100 border-l-4 border-blue-500 light:bg-blue-700 light:border-blue-400"
                        : section === "child"
                        ? "bg-green-100 border-l-4 border-green-500 light:bg-green-700 light:border-green-400"
                        : "bg-yellow-100 border-l-4 border-yellow-500 light:bg-yellow-700 light:border-yellow-400"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        section === "record"
                          ? "text-gray-700 light:text-gray-300"
                          : section === "member"
                          ? "text-blue-700 light:text-blue-300"
                          : section === "child"
                          ? "text-green-700 light:text-green-300"
                          : "text-yellow-700 light:text-yellow-300"
                      }`}
                    >
                      {section === "record"
                        ? "📋 Record Details"
                        : section === "member"
                        ? "👤 Member Details"
                        : section === "child"
                        ? "🧒 Child Details"
                        : "📊 Tracking Details"}
                    </h3>

                    {section === "record" ? (
                      <>
                        <p><strong>Created Date:</strong> {request.RecordId?.CreatedDate || "N/A"}</p>
                        <p><strong>Expired Date:</strong> {request.RecordId?.ExpiredDate || "N/A"}</p>
                        <p><strong>Modified Date:</strong> {request.RecordId?.ModifiedDate || "N/A"}</p>
                        <p><strong>Status:</strong> {request.RecordId?.Status || "N/A"}</p>
                      </>
                    ) : section === "member" ? (
                      <>
                        <p><strong>Parent Name:</strong> {request.RecordId?.OrderId?.buyerName || "N/A"}</p>
                        <p><strong>Email:</strong> {request.RecordId?.OrderId?.memberId?.email || "N/A"}</p>
                        <p><strong>Username:</strong> {request.RecordId?.OrderId?.memberId?.username || "N/A"}</p>
                        <p><strong>Nickname:</strong> {request.RecordId?.OrderId?.memberId?.memberInfo?.nickname || "N/A"}</p>
                        <p><strong>Gender:</strong> {request.RecordId?.OrderId?.memberId?.memberInfo?.gender || "N/A"}</p>
                        <p><strong>Phone:</strong> {request.RecordId?.OrderId?.memberId?.memberInfo?.phone || "N/A"}</p>
                        <p><strong>Address:</strong> {request.RecordId?.OrderId?.memberId?.memberInfo?.address || "N/A"}</p>
                        <p><strong>Birth Date:</strong> {new Date(request.RecordId?.OrderId?.memberId?.memberInfo?.birthdate).toLocaleDateString() || "N/A"}</p>
                        <p><strong>Status:</strong> {request.RecordId?.OrderId?.memberId?.status || "N/A"}</p>
                        <p><strong>Picture:</strong></p>
                        {request.RecordId?.OrderId?.memberId?.memberInfo?.picture ? (
                          <img 
                            src={request.RecordId.OrderId.memberId.memberInfo.picture} 
                            alt="Profile Picture"
                            style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover" }}
                          />
                        ) : (
                          <p>No picture available</p>
                        )}
                      </>
                    ) : section === "child" ? (
                      <>
                        {request.RecordId?.ChildId ? (
                          <>
                            <p><strong>Name:</strong> {request.RecordId.ChildId.fname} {request.RecordId.ChildId.lname}</p>
                            <p><strong>Gender:</strong> {request.RecordId.ChildId.gender}</p>
                            <p><strong>Birthdate:</strong> {new Date(request.RecordId.ChildId.birthdate).toLocaleDateString()}</p>
                            <p><strong>Blood Type:</strong> {request.RecordId.ChildId.blood_type}</p>
                            <p><strong>Notes:</strong> {request.RecordId.ChildId.notes}</p>
                            <p><strong>Allergy:</strong> {request.RecordId.ChildId.allergy}</p>
                            <p><strong>Picture:</strong></p>
                            {request.RecordId?.ChildId?.picture ? (
                              <img 
                                src={request.RecordId.ChildId.picture} 
                                alt={`${request.RecordId.ChildId.fname} ${request.RecordId.ChildId.lname}`} 
                                style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover" }}
                              />
                            ) : (
                              <p>No picture available</p>
                            )}
                          </>
                        ) : (
                          <p>No child information available.</p>
                        )}
                      </>
                    ) : (
                      <>
                      {request.RecordId?.trackingInfo?.length > 0 ? (
                        <TrackingSection trackingInfo={request.RecordId.trackingInfo} />
                      ) : (
                        <p>No tracking information available.</p>
                      )}
                      </>
                    )}
                  </motion.div>
                )
              ))}

              </CardContent>
            </Card>
          ))
        )}
          {/* ✅ Move Modal Outside the Loop */}
          {isModalOpen && (
            <DoctorResponseModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              requestId={selectedRequestId} 
            />
          )}
          <div className="flex justify-center mt-6">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </Button>
          <span className="mx-4">Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
