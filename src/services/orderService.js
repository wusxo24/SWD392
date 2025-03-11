import axios from "@/utils/axiosInstance";

export const fetchOrder = async (orderCode) => {
    try {
        const response = await axios.get(`api/orders/${orderCode}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order details.");
    }
};

export const fetchServiceHistory = async () => {
    try {
        const response = await axios.get("api/orders/member");
        return response.data;
    } catch (error) {
        console.error("Error fetching service history:", error);
        throw new Error("Failed to fetch service history.");
    }
};
