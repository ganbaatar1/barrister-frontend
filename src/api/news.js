// 📁 src/api/news.js
// Мэдээний CRUD API дуудлагууд

import axiosInstance from "./axiosInstance";

/** Бүх мэдээ авах */
export const getNews = (params = {}) =>
  axiosInstance.get("/news", { params });

/** Нэг мэдээ авах */
export const getNewsById = (id) =>
  axiosInstance.get(`/news/${id}`);

/** Мэдээ шинээр үүсгэх */
export const createNews = (payload) =>
  axiosInstance.post("/news", payload);

/** Мэдээ засах */
export const updateNews = (id, payload) =>
  axiosInstance.put(`/news/${id}`, payload);

/** Мэдээ устгах */
export const deleteNews = (id) =>
  axiosInstance.delete(`/news/${id}`);
