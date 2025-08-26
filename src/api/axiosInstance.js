// 📁 src/api/axiosInstance.js
import axios from "axios";

const FALLBACK = "http://localhost:5050/api";
const API_BASE =
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  (typeof window !== "undefined" ? `${window.location.origin}/api` : "") ||
  FALLBACK;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // Cookie хэрэглэхгүй → CORS хялбар
  timeout: 20000,         // 20 секундээс хэтэрвэл cancel
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Network / CORS error";
    console.error(`[API ${status || "ERR"}] ${msg}`, error?.response?.data || error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
