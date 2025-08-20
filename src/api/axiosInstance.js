// 📁 src/api/axiosInstance.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // Cookie хэрэглэхгүй → CORS хялбар
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
