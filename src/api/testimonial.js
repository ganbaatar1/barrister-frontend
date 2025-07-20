// 📁 src/api/testimonials.js
import axiosInstance from "./axiosInstance";

// 📚 Бүх сэтгэгдэл авах
export const getTestimonials = () =>
  axiosInstance.get("/testimonials");

// 🟢 Сэтгэгдэл үүсгэх (зураг багтсан байж болно)
export const createTestimonial = (formData) =>
  axiosInstance.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 🟡 Сэтгэгдэл шинэчлэх
export const updateTestimonial = (id, formData) =>
  axiosInstance.put(`/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 🔴 Сэтгэгдэл устгах
export const deleteTestimonial = (id) =>
  axiosInstance.delete(`/testimonials/${id}`);
