import axiosInstance from "../utils/axiosInstance";

interface SubscriptionService {
  getSubscriptionServices(): Promise<any>;
  getSubscriptionCode(id: string): Promise<string | null>;
}

class SubscriptionServiceImpl implements SubscriptionService {
  private readonly API_URL = "/services";

  async getSubscriptionServices(): Promise<any> {
    try {
      const response = await axiosInstance.get(this.API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription services:", error);
      throw error;
    }
  }

  async getSubscriptionCode(id: string): Promise<string | null> {
    try {
      const services = await this.getSubscriptionServices();
      const service = services.find((service: any) => service._id === id);
      return service ? service.plan_code : null;
    } catch (error) {
      console.error("Error fetching subscription code:", error);
      throw error;
    }
  }
}

const subscriptionService: SubscriptionService = new SubscriptionServiceImpl();
export default subscriptionService;