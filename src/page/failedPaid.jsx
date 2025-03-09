import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
export const FaildedPaid = () => {
    const { id } = useParams(); // Get order ID from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const orderCode = sessionStorage.getItem("orderCode") || localStorage.getItem("orderCode");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`api/orders/${orderCode}`);
                setOrder(response.data);
            } catch (error) {
                setError("Failed to fetch order details.");
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="text-center mt-6">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-6">{error}</div>;

    return (
     <div className="flex bg-[#dde8f8] pt-10 pb-10 h-screen justify-center">
        <div className="max-w-md mx-auto bg-white p-6 shadow-lg w-[900px]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600">Payment Falied</h2>
                <p className="text-gray-500">please try again</p>
            </div>
            <div className="border-t mt-4 pt-4">
                <p className="text-lg font-semibold">Receipt</p>
                <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{order.orderCode}</span></p>
                <p className="text-sm text-gray-500">Transaction Date: {new Date(order.transactionDateTime).toLocaleString()}</p>
            </div>

            <div className="border-t mt-4 pt-4">
                <p className="text-lg font-semibold font-bold">Buyer Details</p>
                <p className="text-sm text-gray-700 font-bold">Name:{order.buyerName}</p>
                <p className="text-sm text-gray-700 font-bold">Email:{order.buyerEmail}</p>
                <p className="text-sm text-gray-700 font-bold">Phone:{order.buyerPhone}</p>
                <p className="text-sm text-gray-700 font-bold">Address:{order.buyerAddress}</p>
            </div>

            <div className="flex justify-center mt-10">
                <Link to={"/Home"} className="text-blue-600"> Return Home</Link>
            </div>
        </div>
    </div>
    );
};
