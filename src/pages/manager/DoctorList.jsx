import { useState, useEffect } from "react";
import SidebarManager from "./SidebarManager";
import { fetchDoctors } from "@/services/doctorService"; 
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, TextField, Typography, Pagination } from "@mui/material";
import { LoadingScreen } from "@/components/loadingScreen";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);  
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Filtered list for display
  const [searchTerm, setSearchTerm] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };
        setLoading(true);
        const response = await fetchDoctors(params);
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
  }, [currentPage]); // Fetching data should not depend on searchTerm

  // **Frontend search filtering**
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = doctors.filter((doctor) =>
      doctor.user_id?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
      doctor.user_id?.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
      doctor.clinic_name?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  return (
    <div className="flex">
      <SidebarManager />
      <div className="flex-1 p-6">
        {/* Search bar */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" color="textPrimary">Doctor List</Typography>
          <TextField
            label="Search Doctor By Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            size="small"
          />
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
                <TableRow>
                  <TableCell colSpan="10" className="text-center py-4">
                    <LoadingScreen />
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>{doctor.user_id?.username}</TableCell>
                    <TableCell>{doctor.gender}</TableCell>
                    <TableCell>{doctor.user_id?.email}</TableCell>
                    <TableCell>{doctor.experience} Years</TableCell>
                    <TableCell>{doctor.certificate}</TableCell>
                    <TableCell>{formatDate(doctor.date)}</TableCell>
                    <TableCell>{doctor.clinic_name}</TableCell>
                    <TableCell>{doctor.ratings.length > 0 ? doctor.ratings.length : "No ratings"}</TableCell>
                    <TableCell>{doctor.license_id?.license_name}</TableCell>
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
      </div>
    </div>
  );
};

export default DoctorList;
