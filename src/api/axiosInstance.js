import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// 🛡 Request interceptor – accessToken нэмэх
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("🔑 Axios interceptor accessToken:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData биш бол JSON гэж үзэж Content-Type тохируулах
    const isFormData = config.data instanceof FormData;
    if (!isFormData && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response interceptor – 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("❌ Unauthorized – accessToken хүчингүй эсвэл дууссан байна");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
