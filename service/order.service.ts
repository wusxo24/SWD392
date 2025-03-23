import axiosInstance from "../utils/axiosInstance";
import subscriptionService from "./subscription.service";

interface OrderService {
  createOrder(orderData: any): Promise<any>;
  getOrders(): Promise<any>;
  getMemberOrders(): Promise<any>;
  deleteOrder(orderId: string): Promise<any>;
}

class OrderServiceImpl implements OrderService {
  private readonly API_URL = "/orders";

  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await axiosInstance.post(this.API_URL, orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrders(): Promise<any> {
    try {
      const response = await axiosInstance.get(this.API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async getMemberOrders(): Promise<any> {
    try {
      const response = await axiosInstance.get(`${this.API_URL}/member`);
      const orders = response.data;

      // Filter orders with status "Paid"
      const paidOrders = orders.filter((order: any) => order.status === "Paid");

      if (paidOrders.length === 0) {
        console.warn("No paid orders found");
        return "Free";
      }

      // Sort orders by createdAt in descending order
      paidOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Get the serviceId of the newest paid order
      const newestPaidOrderId = paidOrders[0].serviceId;

      // Get the plan_code using the serviceId
      const planCode = await subscriptionService.getSubscriptionCode(newestPaidOrderId);
      return planCode;
    } catch (error) {
      const err = error as any;
      if (err.response && err.response.status === 500 && err.response.data.message === "No orders found") {
        console.warn("No orders found");
        return "Free";
      } else {
        console.error("Error fetching member orders:", error);
        throw error;
      }
    }
  }

  async deleteOrder(orderId: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(`${this.API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
}

const orderService: OrderService = new OrderServiceImpl();
export default orderService;