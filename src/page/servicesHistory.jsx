import axios from "../utils/axiosInstance";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export const ServicesHistory = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null); // Track expanded item

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("api/orders/member");
                setData(response.data);
            } catch (error) {
                setError("Failed to fetch service history.");
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-4">Loading...</div>;
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

    return (
        <div className="max-w-2xl mx-auto my-6 p-4 bg-[#f1f5fc] shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Service History</h2>
            <ul className="space-y-3">
                {data
                    .map(item => (
                        <li key={item.id} className="p-4 rounded-lg shadow-lg bg-white ">
                            {/* Main Information Row */}
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                                <p className=" font-medium">
                                    {item.amount} {item.currency}
                                </p>
                                <p className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item.status)}`}>
                                    {item.status}
                                </p>
                                <button 
                                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                                    className="ml-4 text-gray-600 hover:bg-gray-200 rounded-full focus:outline-none cursor-pointer"
                                    style={{fontSize: "large"}}
                                >
                                    {expanded === item.id ? <ArrowDropUpIcon /> : <ArrowDropDownIcon/>}
                                </button>
                            </div>

                            {/* Dropdown Details */}
                            {expanded == item.id && (
                                <div className="mt-3 p-3 bg-white ">
                                    <p><strong>Description:</strong> {item.description}</p>
                                    <p><strong>Payment Method:</strong> {item.paymentMethod}</p>
                                    <p><strong>Payment Status:</strong> {item.paymentStatus}</p>
                                    <p><strong>Transaction Date:</strong> {new Date(item.transactionDateTime).toLocaleString()}</p>
                                </div>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};
