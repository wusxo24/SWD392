import React, { useEffect, useState } from "react";
import {
  getRecordsByMemberId as getUserRecords,
  activateRecord,
} from "@/services/recordService";
import { getChildren } from "@/services/childService";
import { getPricingPlans } from "@/services/pricingService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserRecord = () => {
  const [records, setRecords] = useState([]);
  const [plans, setPlans] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    fetchRecords();
    fetchPlans();
    fetchChildren();
  }, []);

  const getChildAgeInMonths = (childId) => {
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
  
    const ageInMonths = getChildAgeInMonths(record.ChildId);
    if (ageInMonths === null) {
      toast.error("Child's date of birth is missing.");
      return;
    }
  
    if (ageInMonths <= 36) {
      window.location.href = `/childGrowthBaby/${record._id}`;
    } else if (ageInMonths >= 36 && ageInMonths <= 240) {
      window.location.href = `/childGrowth/${record._id}`;
    } else {
      toast.error("Child's age is out of the valid range.");
    }
  };

  const fetchRecords = async () => {
    try {
      const data = await getUserRecords();
      setRecords(Array.isArray(data.data) ? data.data : []);
      console.log(records);
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

  const fetchChildren = async () => {
    try {
      const data = await getChildren();
      setChildren(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Still not active yet";

  const openChildSelectionModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleSelectChild = async (childId) => {
    if (!selectedRecord) return;
    try {
      await activateRecord(selectedRecord._id, childId);
      await fetchRecords();
      toast.success("Record activated successfully");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to activate record");
    }
  };

  const getPlanName = (orderId) => {
    const plan = plans.find((plan) => plan._id === orderId);
    return plan ? plan.name : "N/A";
  };

  const getChildName = (childId) => {
    if (!childId) return "You haven't assigned any child yet";
    const child = children.find((c) => c._id === childId);
    return child ? `${child.fname} ${child.lname}` : "Child not found";
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setPage(0);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRecords =
    filter === "All" ? records : records.filter((r) => r.Status === filter);

  return (
    <div className="p-5 h-screen bg-[#f6f7f8] px-30">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">User Records</h2>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        className="mb-4"
      >
        <ToggleButton value="All">All</ToggleButton>
        <ToggleButton value="Activated">Activated</ToggleButton>
        <ToggleButton value="Inactivated">Inactivated</ToggleButton>
        <ToggleButton value="Expired">Expired</ToggleButton>
      </ToggleButtonGroup>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : records.length === 0 ? (
        <p className="text-gray-500">No records available.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Plan Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Expiry Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Child</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {getPlanName(record.OrderId?.serviceId)}
                    </TableCell>
                    <TableCell>{formatDate(record.ExpiredDate)}</TableCell>
                    <TableCell>{getChildName(record.ChildId)}</TableCell>
                    <TableCell>{record.Status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={
                          record.Status === "Activated" ? "primary" : "success"
                        }
                        disabled={record.Status === "Expired"}
                        onClick={() =>
                          record.Status === "Activated"
                            ? handleRedirect(record)
                            : openChildSelectionModal(record)
                        }
                      >
                        {record.Status === "Activated"
                          ? "Child Growth"
                          : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[6, 12, 24]}
            component="div"
            count={filteredRecords.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      {/* Child Selection Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Select a Child</DialogTitle>
        <DialogContent>
          {children.length === 0 ? (
            <p>No children available.</p>
          ) : (
            children.map((child) => (
              <Button
                key={child._id}
                onClick={() => handleSelectChild(child._id)}
                fullWidth
                className="mb-2"
              >
                {child.fname} {child.lname}
              </Button>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
