import axiosInstance from "./axiosInstance";

// ✅ Нүүр хуудасны агуулга авах
export const getHomeContent = () => axiosInstance.get("/home");

// ✅ Нүүр хуудасны агуулга шинэчлэх
export const updateHomeContent = (data) => axiosInstance.put("/home", data);

// ✅ Зураг байршуулах (formData ашиглан, content-type override хийж)
export const uploadHomeImage = (formData) =>
  axiosInstance.post("/home/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // ⬅️ override content-type
    },
  });
