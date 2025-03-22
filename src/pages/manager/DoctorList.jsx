import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import SidebarManager from "./SidebarManager";
const API_URL = ""; // Thay thế bằng API endpoint của bạn

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; // Số lượng bác sĩ hiển thị trên mỗi trang

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const params = {
          page: currentPage + 1,
          limit: itemsPerPage,
          search: searchTerm,
          sortKey: sortConfig.key,
          sortDirection: sortConfig.direction,
        };
        const response = await axios.get(API_URL, { params });
        setDoctors(response.data.doctors);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, [currentPage, searchTerm, sortConfig]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
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

  return (
    <div className="flex">
      <SidebarManager />
      <div className="flex-1 p-6">
        {/* Thanh tìm kiếm */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Doctor List</h2>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Bảng hiển thị danh sách bác sĩ */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name {renderSortArrow("name")}
                </th>
                <th>Gender</th>
                <th>Email</th>
                <th>Experience</th>
                <th>certificate</th>
                <th>Address</th>
                <th>Clinic Name</th>
                <th>About</th>
                <th>Degree</th>
                <th>Picture</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(doctors) && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr
                    key={doctor.user_id}
                    className="border-b hover:bg-gray-100"
                  >
                    <td>{doctor.name}</td>
                    <td>{doctor.gender}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.experience}</td>
                    <td>{doctor.certificate}</td>
                    <td>{doctor.address}</td>
                    <td>{doctor.clinic_name}</td>
                    <td>{doctor.about}</td>
                    <td>{doctor.degree}</td>
                    <td>
                      <img
                        src={doctor.picture}
                        alt={doctor.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-600">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Phân trang */}
        <div className="flex justify-center mt-6">
          <ReactPaginate
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"flex space-x-2"}
            pageClassName={
              "px-3 py-2 border rounded-lg hover:bg-blue-200 transition"
            }
            activeClassName={"bg-blue-500 text-white font-bold"}
            previousClassName={"px-3 py-2 border rounded-lg hover:bg-gray-200"}
            nextClassName={"px-3 py-2 border rounded-lg hover:bg-gray-200"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
