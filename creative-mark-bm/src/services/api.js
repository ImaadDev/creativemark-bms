// API service
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

console.log('API Service initialized with backend URL:', backendUrl);

const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true, // important for cookies
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status || 'Network Error';
    const url = error.config?.url || 'Unknown URL';
    const data = error.response?.data || error.message;
    
    // Don't log 401 errors for /auth/me as they're expected when user is not authenticated
    if (status === 401 && url.includes('/auth/me')) {
      console.log(`API Info: ${status} ${url} - User not authenticated (expected)`);
    } else {
      console.error(`API Error: ${status} ${url}`, data);
    }
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('Backend server is not running. Please start the server at http://localhost:5000');
    }
    
    return Promise.reject(error);
  }
);


// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    console.log('Backend health check:', response.data);
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return false;
  }
};

export default api;
