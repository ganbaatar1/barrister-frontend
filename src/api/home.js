import axiosInstance from "./axiosInstance";

// ✅ Нүүр хуудасны агуулга авах
export const getHomeContent = () => axiosInstance.get("/home");

// ✅ Нүүр хуудасны агуулга шинэчлэх (олон зурагтай)
export const updateHomeContent = (data) => {
  // data.images = [{ url: "/uploads/home/image.jpg", caption: "..." }, ...]
  return axiosInstance.put("/home", data);
};

// ✅ Зураг байршуулах (олон зураг → нэг бүрчлэн formData-аар дамжуулна)
export const uploadHomeImage = (formData) =>
  axiosInstance.post("/home/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // ⬅️ override content-type
    },
  });
