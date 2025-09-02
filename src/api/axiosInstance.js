// 📁 src/api/axiosInstance.js
import axios from "axios";

const FALLBACK = "http://localhost:5050/api";
const API_BASE =
  (typeof window !== "undefined" ? `${window.location.origin}/api` : "") ||
  process.env.REACT_APP_API_BASE_URL?.trim() ||
  FALLBACK;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 60000,
});

// Helper
const isFormData = (data) =>
  typeof FormData !== "undefined" && data instanceof FormData;

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // ❗ ЗӨВ: FormData бол Content-Type-г бүр мөсөн орхи (browser/axios өөрөө boundary тавина)
  if (isFormData(config.data)) {
    if (config.headers && "Content-Type" in config.headers) {
      delete config.headers["Content-Type"];
    }
  } else {
    // JSON payload үед л JSON header тавина (GET/DELETE-д хэрэггүй)
    const method = (config.method || "get").toLowerCase();
    if (["post", "put", "patch"].includes(method)) {
      if (!config.headers || !config.headers["Content-Type"]) {
        config.headers = { ...(config.headers || {}), "Content-Type": "application/json" };
      }
    }
  }
  return config;
});

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
