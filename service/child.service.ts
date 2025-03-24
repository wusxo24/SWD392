import axiosInstance from "../utils/axiosInstance";

interface Child {
  id: string;
  fname: string;
  lname: string;
  memberID: number;
  birthdate: string;
  gender: string;
  picture: string;
  blood_type: string;
  allergy: string;
  notes: string;
}

interface ChildService {
  getChildren(): Promise<Child[]>;
  getChildById(id: string): Promise<Child | null>;
  createChild(childData: Partial<Child>): Promise<Child>;
  updateChild(id: string, childData: Partial<Child>): Promise<Child>;
  deleteChild(id: string): Promise<void>;
}

class ChildServiceImpl implements ChildService {
  private readonly API_URL = "/children";

  async getChildren(): Promise<Child[]> {
    try {
      const response = await axiosInstance.get(this.API_URL);
      return response.data;
    } catch (error) {
      const err = error as any;
      if (err.response && err.response.status === 500 && err.response.data.message === "Lỗi khi lấy thông tin child") {
        console.warn("Error fetching children: Lỗi khi lấy thông tin child");
        return [];
      } else {
        console.error("Error fetching children:", error);
        throw error;
      }
    }
  }

  async getChildById(id: string): Promise<Child | null> {
    try {
      const response = await axiosInstance.get(`${this.API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching child with ID ${id}:`, error);
      throw error;
    }
  }

  async createChild(childData: Partial<Child>): Promise<Child> {
    try {
      // Format the birthdate to ISO string if it exists
      if (childData.birthdate) {
        childData.birthdate = new Date(childData.birthdate as unknown as string).toISOString() as any;
      }
      const response = await axiosInstance.post(this.API_URL, childData);
      return response.data;
    } catch (error) {
      console.error("Error creating child:", error);
      throw error;
    }
  }

  async updateChild(id: string, childData: Partial<Child>): Promise<Child> {
    try {
      // Format the birthdate to ISO string if it exists
      if (childData.birthdate) {
        childData.birthdate = new Date(childData.birthdate as unknown as string).toISOString() as any;
      }
      const response = await axiosInstance.put(`${this.API_URL}/${id}`, childData);
      return response.data;
    } catch (error) {
      console.error(`Error updating child with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteChild(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
      throw error;
    }
  }
}

const childService: ChildService = new ChildServiceImpl();
export default childService;