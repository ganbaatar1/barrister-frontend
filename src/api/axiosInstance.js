// src/api/axiosInstance.js
import axios from "axios";

/**
 * DEV: CRA proxy ашиглахдаа baseURL = "/api"
 * PROD: REACT_APP_API_BASE (эсвэл REACT_APP_API_BASE_URL) ашиглана
 *  └─ Жишээ: REACT_APP_API_BASE=https://barrister-backend.onrender.com/api
 */
const envBase =
  (process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_BASE_URL || "").trim();

const API_BASE = envBase || "/api"; // env байхгүй бол DEV proxy /api руу дамжина

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// 🔐 Authorization header шургуулна (локал storage-оос)
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* noop */
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Хариу интерсептор (шаардлагатай бол 401 дээр навигаци хийх боломжтой)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    // Жишээ: if (err?.response?.status === 401) window.location.href = "/login";
    return Promise.reject(err);
  }
);

export default axiosInstance;
