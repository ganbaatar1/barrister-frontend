import axiosInstance from "./axiosInstance";

// ✅ Нүүр хуудасны агуулга авах
export const getHomeContent = () => axiosInstance.get("/home");

// ✅ Нүүр хуудасны агуулга шинэчлэх (олон зурагтай)
export const updateHomeContent = (data) => {
  return axiosInstance.put("/home", data);
};

// ✅ Зураг байршуулах — File эсвэл FormData аль алиныг дэмжинэ
export const uploadHomeImage = (data) => {
  let formData = data;
  if (!(data instanceof FormData)) {
    formData = new FormData();
    formData.append("image", data);
  }
  return axiosInstance.post("/home/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(res => res.data);
};
