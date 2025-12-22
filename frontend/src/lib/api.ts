import axios from 'axios';
import { authService } from './auth';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/predict";

export const predictImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const headers: any = {
    "Content-Type": "multipart/form-data"
  };

  // Add authorization header if user is authenticated
  const token = authService.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(apiUrl, formData, {
      headers
    });
    
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};