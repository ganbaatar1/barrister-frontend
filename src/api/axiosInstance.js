// 📁 src/api/axiosInstance.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // хэрвээ cookie ашигладаг бол
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // ✅ Продод токен хэвлэхгүй, дев дээр богиносгож хэвлэж болно
    if (process.env.NODE_ENV !== "production") {
      console.log("🔑 Axios interceptor accessToken:", token.slice(0, 16) + "…");
    }
  }
  return config;
});

export default axiosInstance;
