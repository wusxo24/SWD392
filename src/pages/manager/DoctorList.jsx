import { useState, useEffect } from "react";
import SidebarManager from "./SidebarManager";
import { fetchDoctors } from "@/services/doctorService"; // Import the fetchDoctors function
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, TextField, Typography, Pagination } from "@mui/material";
import { LoadingScreen } from "@/components/loadingScreen";
import { Bold } from "lucide-react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1); // Start at page 1 for MUI Pagination
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; // Number of doctors per page
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          sortKey: sortConfig.key,
          sortDirection: sortConfig.direction,
        };
        setLoading(true);
        // Call the fetchDoctors function
        const response = await fetchDoctors(params); // Pass params to the function
        console.log("Doctors data:", response);
        setDoctors(response);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [currentPage, searchTerm, sortConfig]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Set the page number based on the MUI Pagination component
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date as MM/DD/YYYY or as per locale
  };
  
  return (
    <div className="flex">
      <SidebarManager />
      <div className="flex-1 p-6">
      
          <>
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" color="textPrimary">Doctor List</Typography>
        
        </div>

        {/* Doctor list table */}
        <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
          <Table aria-label="doctor list table">
            <TableHead sx={{ background: "#51a2ff" }}>
              <TableRow>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Gender</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Experience</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Certificate</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>BirthDay</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Clinic Name</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Degree</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Picture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {loading ? (  
                <tr>
                <td colSpan="12" className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <LoadingScreen />
                  </div>
                </td>
              </tr>
            ) : Array.isArray(doctors) && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>{doctor.user_id?.username}</TableCell> {/* Accessing nested username */}
                    <TableCell>{doctor.gender}</TableCell>
                    <TableCell>{doctor.user_id?.email}</TableCell> {/* Accessing nested email */}
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>{doctor.certificate}</TableCell>
                    <TableCell>{formatDate(doctor.date)}</TableCell> {/* Example of a date field */}
                    <TableCell>{doctor.clinic_name}</TableCell>
                    <TableCell>{doctor.ratings.length > 0 ? doctor.ratings.length : "No ratings"}</TableCell>
                    <TableCell>{doctor.license_id?.license_name}</TableCell> {/* Accessing nested license_name */}
                    <TableCell>
                      <img
                        src={doctor.picture}
                        alt={doctor.user_id?.username}
                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "8px" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No doctors found.
                  </TableCell>
                </TableRow>
              )}
            
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
          </>
      </div>
    </div>
  );
};

export default DoctorList;
