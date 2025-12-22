import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/predict', '') || "http://localhost:8000";

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password
      });
      
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      return response.data;
    } catch (error: any) {
      this.logout();
      throw new Error(error.response?.data?.detail || 'Failed to get user');
    }
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();