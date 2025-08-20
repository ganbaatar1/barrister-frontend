// 📁 src/api/advice.js
import axiosInstance from "../api/axiosInstance";

const api = {
  getAdvice: () => axiosInstance.get("/advice"),
  getAdviceById: (id) => axiosInstance.get(`/advice/${id}`).then((res) => res.data),
  createAdvice: (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("seoTitle", data.seoTitle || "");
    formData.append("seoDescription", data.seoDescription || "");
    formData.append("seoKeywords", data.seoKeywords || "");
    if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
    if (data.media instanceof File) {
      formData.append("media", data.media);
    }
    return axiosInstance.post("/advice", formData);
  },
  updateAdvice: (id, data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("seoTitle", data.seoTitle || "");
    formData.append("seoDescription", data.seoDescription || "");
    formData.append("seoKeywords", data.seoKeywords || "");
    if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
    if (data.media instanceof File) {
      formData.append("media", data.media);
    }
    return axiosInstance.put(`/advice/${id}`, formData);
  },
  deleteAdvice: (id) => axiosInstance.delete(`/advice/${id}`),
};

export default api;
