import { fetchServiceHistory } from "@/services/orderService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { LoadingScreen } from "@/components/loadingScreen";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
} from "@mui/material";

export const ServicesHistory = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const loadServiceHistory = async () => {
            try {
                const historyData = await fetchServiceHistory();
                console.log(historyData)
                const sortedData = historyData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
                setData(sortedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadServiceHistory();
    }, []);

    if (loading) return <LoadingScreen />;
    if (error) return <div className="text-center text-red-500 mt-4">Error: {error}</div>;

    // Status color mapping
    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-200 text-yellow-800";
            case "Paid":
                return "bg-green-200 text-green-800";
            case "Canceled":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="max-w-4xl mx-auto my-6 p-4 bg-[#f1f5fc] shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center ">Service History</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Amount</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Details</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
                            <React.Fragment key={item._id}>
                                {/* Main Row */}
                                <TableRow>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{item.amount} {item.currency}</TableCell>
                                    <TableCell>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <button 
                                            onClick={() => setExpanded(expanded === item._id ? null : item._id)}
                                            className="text-gray-600 hover:bg-gray-200 rounded-full focus:outline-none cursor-pointer"
                                            style={{ fontSize: "large" }}
                                        >
                                            {expanded === item._id ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                        </button>
                                    </TableCell>
                                </TableRow>

                                {/* Expanded Details Row */}
                                {expanded === item._id && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="bg-gray-100 p-4">
                                            <p><strong>Description:</strong> {item.description}</p>
                                            <p><strong>Payment Method:</strong> {item.paymentMethod || "Processing..."}</p>
                                            <p><strong>Payment Status:</strong> {item.paymentStatus || "Processing..."}</p>
                                            <p><strong>Transaction Date:</strong> {item.transactionDateTime ? new Date(item.transactionDateTime).toLocaleString() : "Processing..." }</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>

                {/* ✅ MUI TablePagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};
