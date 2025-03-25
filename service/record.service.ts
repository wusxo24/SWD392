import axiosInstance from "../utils/axiosInstance";

interface RecordService {
  createRecord(recordData: { OrderId: string }): Promise<any>;
  activateRecord(requestData: {
    recordId: string;
    childId: string;
  }): Promise<any>;
  deactivateRecord(requestData: { recordId: string }): Promise<any>;
  getRecordsByMemberId(): Promise<any>;
}

class RecordServiceImpl implements RecordService {
  private readonly API_URL = "/records";

  async createRecord(recordData: { OrderId: string }): Promise<any> {
    try {
      const response = await axiosInstance.post(this.API_URL, recordData);
      return response.data;
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  }

  async activateRecord(requestData: {
    recordId: string;
    childId: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.put(
        `${this.API_URL}/activate`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error activating record:", error);
      throw error;
    }
  }

  async deactivateRecord(requestData: { recordId: string }): Promise<any> {
    try {
      const response = await axiosInstance.put(
        `${this.API_URL}/deactivate`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error deactivating record:", error);
      throw error;
    }
  }

  async getRecordsByMemberId(): Promise<any> {
    try {
      const response = await axiosInstance.get(this.API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  }
}

const recordService: RecordService = new RecordServiceImpl();
export default recordService;
