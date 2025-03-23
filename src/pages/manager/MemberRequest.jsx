import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Avatar, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import SidebarManager from "./SidebarManager";
import { getAllMedicalRequests, acceptMedicalRequest, rejectMedicalRequest } from "@/services/medicalRequest";
import { toast } from "react-toastify";
import { fetchDoctors } from "@/services/doctorService";  // Import your fetchDoctors function

const MemberRequest = () => {
  const [requests, setRequests] = useState([]);
  const [openDoctorModal, setOpenDoctorModal] = useState(false); // Modal visibility
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Selected doctor
  const [currentRequestId, setCurrentRequestId] = useState(null); // ID of the medical request being accepted
  const [doctors, setDoctors] = useState([]); // List of doctors
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [managerId, setManagerId] = useState(null); // State to store ManagerId

  // Get ManagerId from localStorage
  useEffect(() => {
    const storedManagerId = localStorage.getItem('userId'); // Assuming userId is the ManagerId
    console.log("Manager ID:", storedManagerId);
    setManagerId(storedManagerId);
  }, []);
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true); // Start loading
      try {
        
        const response = await getAllMedicalRequests();
        const sortedRequests = response.sort((a, b) => {
          // Priority sorting by status (Pending > Normal)
          if (a.Status === "Pending" && b.Status !== "Pending") return -1;
          if (b.Status === "Pending" && a.Status !== "Pending") return 1;
          console.log("medical Id", response._id);
          // If status is the same, sort by CreatedDate (newest first)
          return new Date(b.CreatedDate) - new Date(a.CreatedDate);
        });
        setRequests(sortedRequests); // Set the sorted requests
        setFilteredRequests(sortedRequests); // Set initial filtered requests
      } catch (error) {
        console.error("Failed to fetch requests", error);
        setRequests([]); // Set empty array if an error occurs
        setFilteredRequests([]); // Set empty filtered array
      } finally {
        setLoading(false); // End loading
      }
    };
  
    const fetchAvailableDoctors = async () => {
      setLoading(true); // Start loading for doctors
      try {
        const doctorsList = await fetchDoctors(); // Call the fetchDoctors function
        setDoctors(doctorsList); // Set the doctors list
      } catch (error) {
        console.error("Failed to fetch doctors", error);
        setDoctors([]); // Handle error by setting an empty list
      } finally {
        setLoading(false); // End loading for doctors
      }
    };

    fetchRequests();
    fetchAvailableDoctors();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFilteredRequests(requests.filter(req => req.Status === statusFilter));
    } else {
      setFilteredRequests(requests); // If no filter is selected, show all
    }
  }, [statusFilter, requests]);

  const handleAccept = (medicalRequestId) => {
    setCurrentRequestId(medicalRequestId); // Store the current request ID
    setOpenDoctorModal(true); // Open the doctor selection modal
  };

  const handleModalClose = () => {
    setOpenDoctorModal(false);
    setSelectedDoctor(null); // Clear the selected doctor when modal closes
  };

  const handleDoctorSelection = async (doctorId) => {
    if (!doctorId) {
      toast.error("Please select a doctor.");
      return;
    }
    try {
      const response = await acceptMedicalRequest(currentRequestId, doctorId,managerId);
      setRequests(requests.map(req => req._id === currentRequestId ? { ...req, Status: 'Accepted', DoctorId: doctorId } : req));
      setOpenDoctorModal(false); // Close modal after acceptance
      setSelectedDoctor(null); // Clear selected doctor
      toast.success("Medical request accepted successfully!");
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleReject = async (medicalRequestId) => {
    try {
      const response = await rejectMedicalRequest(medicalRequestId);
      setRequests(requests.map(req => req._id === medicalRequestId ? { ...req, Status: 'Rejected' } : req));
      toast.success("Medical request rejected successfully!");
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  return (
    <div className="flex">
      <SidebarManager />
      <div className="p-4 w-full">
        <h2 className="text-xl font-bold mb-4">Member Requests</h2>
        <FormControl variant="outlined" className="mb-4" style={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : filteredRequests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
          <TableContainer component={Paper} className="mb-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>
                      {req.CreatedDate ? new Date(req.CreatedDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>{req.Reason || "No reason provided"}</TableCell>
                    <TableCell>{req.Status || "Unknown"}</TableCell>
                    <TableCell>
                      {req.Status === "Pending" && (
                        <div>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAccept(req._id)}
                            className="mr-2"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(req._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Doctor Selection Modal */}
      <Dialog open={openDoctorModal} onClose={handleModalClose}>
        <DialogTitle>Select a Doctor</DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="flex justify-center items-center">
              <CircularProgress />
            </div>
          ) : (
            <List>
              {doctors.map((doctor) => (
                <ListItem
                  button="true" 
                  key={doctor._id}
                  onClick={() => handleDoctorSelection(doctor._id)}
                  selected={selectedDoctor === doctor._id}
                  className="cursor-pointer min-w-[500px] items-start"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr', alignItems: 'center' }}
                >
                  <Avatar 
                    src={doctor.picture || "/default-avatar.jpg"} 
                    className="mr-2"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <ListItemText 
                    primary={doctor.user_id?.username} 
                    style={{ margin: 0 }}
                  />
                  <ListItemText 
                    primary={doctor.experience} 
                    style={{ margin: 0 }}
                  />
                  <ListItemText 
                    primary={doctor.certificate} 
                    style={{ margin: 0 }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleDoctorSelection(selectedDoctor)} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MemberRequest;
