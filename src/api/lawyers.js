// 📁 src/api/lawyers.js
import axiosInstance from "./axiosInstance";

// ✅ Бүх хуульчдыг авах
export const getAllLawyers = () => axiosInstance.get("/lawyers");

// ✅ Шинэ хуульч үүсгэх (зураг оруулах боломжтой)
export const createLawyer = (formData) =>
  axiosInstance.post("/lawyers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Хуульчийн мэдээлэл шинэчлэх
export const updateLawyer = (id, formData) =>
  axiosInstance.put(`/lawyers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Хуульч устгах
export const deleteLawyer = (id) =>
  axiosInstance.delete(`/lawyers/${id}`);
