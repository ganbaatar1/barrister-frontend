import axios from "axios";

// 🔗 API үндсэн URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";

// ✅ Axios instance үүсгэх
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

    // Content-Type-г зөв тохируулах
    const isFormData = config.data instanceof FormData;
    if (!config.headers["Content-Type"] && !isFormData) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Response interceptor – 401 алдаанд хариу өгөх
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("❌ Unauthorized – нэвтрэх шаардлагатай эсвэл accessToken хүчингүй байна");
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
