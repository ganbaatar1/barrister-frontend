// 📁 src/api/contactSettings.js
import axiosInstance from "./axiosInstance";

export const getContactSettings = () => axiosInstance.get("/contactSettings");

export const updateContactSettings = (data) => axiosInstance.put("/contactSettings", data);
