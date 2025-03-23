import { useEffect, useState } from "react";
import SidebarManager from "./SidebarManager";
import { fetchAllOrders } from "@/services/orderService";
import { getPricingPlans } from "@/services/pricingService";
import { LoadingScreen } from "@/components/loadingScreen";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch orders
        const ordersData = await fetchAllOrders();

        // Fetch service plans
        const servicesData = await getPricingPlans();

        // Convert services array into an object {serviceId: serviceName}
        const serviceMap = {};
        servicesData.forEach((service) => {
          serviceMap[service._id] = service.name; // Assuming 'name' is the service name
        });

        setOrders(ordersData);
        setServices(serviceMap);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="flex">
      <SidebarManager />
      <div className="p-4 w-full">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        {loading ? (
          <LoadingScreen />
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Order Code</th>
                <th className="border border-gray-300 p-2">Buyer</th>
                <th className="border border-gray-300 p-2">Service</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Payment Method</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{order.orderCode}</td>
                  <td className="border border-gray-300 p-2">{order.buyerName}</td>
                  <td className="border border-gray-300 p-2">{services[order.serviceId] || "Unknown"}</td>
                  <td className="border border-gray-300 p-2">
                    {order.amount} {order.currency}
                  </td>
                  <td className="border border-gray-300 p-2">{order.status}</td>
                  <td className="border border-gray-300 p-2">{order.paymentMethod || "N/A"}</td>
                  <td className="border border-gray-300 p-2">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
