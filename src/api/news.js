// 📁 src/api/news.js
import axiosInstance from "./axiosInstance";

// 🟢 Мэдээ үүсгэх (зурагтай + FormData)
export const createNews = (formData) =>
  axiosInstance.post("/news", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 🧠 FormData үед заавал нэмэх
    },
  });

// 🟡 Мэдээ шинэчлэх
export const updateNews = (id, formData) =>
  axiosInstance.put(`/news/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// 🔴 Мэдээ устгах
export const deleteNews = (id) => axiosInstance.delete(`/news/${id}`);

// 📘 Нэг мэдээ авах
export const getNews = (id) => axiosInstance.get(`/news/${id}`);

// 📚 Бүх мэдээ авах
export const getAllNews = () => axiosInstance.get("/news");

// 🖼 Зураг upload (хэрэв тусдаа upload route байвал)
export const uploadNewsImage = (formData) =>
  axiosInstance.post("/news/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
