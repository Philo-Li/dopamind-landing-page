import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // For now, we'll skip authentication until auth system is implemented
    // const token = await getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      console.error('[API Client] Unauthorized access');
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('[API Client] Forbidden access');
    } else if (error.response?.status && error.response.status >= 500) {
      // Server errors
      console.error('[API Client] Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);