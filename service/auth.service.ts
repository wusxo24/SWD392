import AsyncStorage from '@react-native-async-storage/async-storage';
import { post } from '../utils/axiosInstance';

interface AuthService {
  login(username: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

class AuthServiceImpl implements AuthService {
  private readonly tokenKey = 'authToken';

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await post('/auth', { username, password });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem(this.tokenKey, response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.tokenKey);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(this.tokenKey);
    return token !== null;
  }
}

const authService: AuthService = new AuthServiceImpl();
export default authService;