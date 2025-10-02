// API service
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true, // important for cookies
  timeout: 10000, // 10 second timeout
});







export default api;
