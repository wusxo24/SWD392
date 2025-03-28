import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Avatar, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, CircularProgress, Menu, TablePagination, TableFooter } from "@mui/material";
import SidebarManager from "./SidebarManager";
import { getAllMedicalRequests, acceptMedicalRequest, rejectMedicalRequest } from "@/services/medicalRequestService";
import { toast } from "react-toastify";
import { fetchApprovedAvailableDoctors } from "@/services/doctorService";  // Import your fetchDoctors function
import { LoadingScreen } from "@/components/loadingScreen";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get ManagerId from localStorage
  useEffect(() => {
    const storedManagerId = localStorage.getItem('userId') || sessionStorage.getItem('userId'); // Assuming userId is the ManagerId
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
        const doctorsList = await fetchApprovedAvailableDoctors(); // Call the fetchDoctors function
        console.log("Doctors List:", doctorsList);
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

  const handleMenuOpen = (event, requestId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequestId(requestId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequestId(null);
  };

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
      const response = await acceptMedicalRequest(currentRequestId, doctorId, managerId);
      const assignedDoctor = doctors.find(doc => doc.user_id === doctorId);
      // Update the state immediately
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req._id === currentRequestId
            ? { 
                ...req, 
                Status: 'Approved', 
                DoctorId: { 
                  _id: doctorId, 
                  username: assignedDoctor?.username // Ensure username is included
                }, 
                DoctorInfo: assignedDoctor
              }
            : req
        )
      );
      setOpenDoctorModal(false); // Close modal after acceptance
      setSelectedDoctor(null); // Clear selected doctor
      toast.success("Medical request accepted successfully!");
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  // Pagination Handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
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
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingScreen />
          </div>
        ) : filteredRequests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
        <TableContainer component={Paper} className="mb-4 mt-4">
          <Table>
            <TableHead style={{ background: "#51a2ff" }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Doctor Incharge</TableCell> {/* New column */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((req) => (              
                <TableRow key={req._id}>
                  <TableCell>{req.CreatedDate ? new Date(req.CreatedDate).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{req.Reason || "No reason provided"}</TableCell>
                  <TableCell>{req.Status || "Unknown"}</TableCell>
                  {/* Doctor Incharge Column */}
                  <TableCell>
                    {req.DoctorInfo ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={req.DoctorInfo.picture || "/default-avatar.jpg"}
                          style={{ width: 40, height: 40, marginRight: 10 }}
                        />
                        <span>{req.DoctorId.username || "Unknown Doctor"}</span>
                      </div>
                    ) : (
                      "Not Assigned"
                    )}
                  </TableCell>
                  <TableCell style={{ width: "10%" }}>
                    {req.Status === "Pending" && (
                      <>
                        <IconButton onClick={(e) => handleMenuOpen(e, req._id)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl && selectedRequestId === req._id)} onClose={handleMenuClose}>
                          <MenuItem onClick={() => { handleAccept(req._id); handleMenuClose(); }}>Accept</MenuItem>
                          <MenuItem onClick={() => { handleReject(req._id); handleMenuClose(); }}>Reject</MenuItem>
                        </Menu>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={filteredRequests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
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
              {/* Header Row */}
              <ListItem
                className="font-bold"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr", // 5 columns
                  alignItems: "center",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <ListItemText primary="Avatar" />
                <ListItemText primary="Name" />
                <ListItemText primary="Experience" />
                <ListItemText primary="Certificate" />
                <ListItemText primary="Received requests" />
              </ListItem>

              {/* Doctor List */}
              {doctors.map((doctor) => (
                <ListItem
                  button="true"
                  key={doctor._id}
                  onClick={() => handleDoctorSelection(doctor.user_id)}
                  selected={selectedDoctor === doctor._id}
                  className="cursor-pointer min-w-[500px] items-start"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 2fr 2fr 2fr", // Now matches header
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={doctor.picture || "/default-avatar.jpg"}
                    className="mr-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  <ListItemText primary={doctor.username} style={{ margin: 0 }} />
                  <ListItemText primary={doctor.experience} style={{ margin: 0 }} />
                  <ListItemText primary={doctor.certificate} style={{ margin: 0 }} />
                  <ListItemText primary={doctor.approvedCount} style={{ margin: 0 }} />
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
