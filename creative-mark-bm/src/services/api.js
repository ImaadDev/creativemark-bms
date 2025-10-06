// API service
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true, // important for cookies
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log("=== API REQUEST DEBUG ===");
    console.log("Method:", config.method?.toUpperCase());
    console.log("URL:", config.url);
    console.log("Full URL:", config.baseURL + config.url);
    console.log("withCredentials:", config.withCredentials);
    console.log("Headers:", config.headers);
    console.log("Cookies:", document.cookie);
    console.log("=========================");
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.status, error.config?.url);
    console.error("API Response Error Data:", error.response?.data);
    return Promise.reject(error);
  }
);








export default api;
