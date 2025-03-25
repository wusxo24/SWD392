import { Order } from "@/models/Order.model";
import axiosInstance from "../utils/axiosInstance";
import subscriptionService from "./subscription.service";

interface OrderService {
  createOrder(orderData: any): Promise<any>;
  getOrders(): Promise<any>;
  getMemberOrder(): Promise<Order[]>;
  getMemberOrdersCode(): Promise<any>;
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

  async getMemberOrder(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`${this.API_URL}/member`);
      return response.data;
    } catch (error) {
      console.error("Error fetching member orders:", error);
      throw error;
    }
  }

  async getMemberOrdersCode(): Promise<{ planCode: string | null, _id: string } | string> {
    try {
      const response = await axiosInstance.get(`${this.API_URL}/member`);
      const orders: Order[] = response.data;
  
      // Filter orders with status "Paid"
      const paidOrders = orders.filter(order => order.status === "Paid");
  
      if (paidOrders.length === 0) {
        console.warn("No paid orders found");
        return "Free";
      }
  
      // Sort orders by createdAt in descending order
      paidOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
      // Get the serviceId and _id of the newest paid order
      const newestPaidOrder = paidOrders[0];
      const newestPaidOrderId = newestPaidOrder.serviceId;
      const newestPaidOrder_Id = newestPaidOrder._id;
  
      // Get the plan_code using the serviceId
      const planCode = await subscriptionService.getSubscriptionCode(newestPaidOrderId);
      return { planCode, _id: newestPaidOrder_Id };
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