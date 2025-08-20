// 📁 src/api/home.js
import axiosInstance from "../api/axiosInstance";

const toRelative = (url) => {
  if (!url) return "";
  try {
    if (/^https?:\/\//i.test(url)) {
      const u = new URL(url);
      return u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
    }
    return url.startsWith("/") ? url : `/${url}`;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
};

// ✅ Нүүр хуудасны агуулга авах
export const getHomeContent = () => axiosInstance.get("/home");

// ✅ Нүүр хуудасны агуулга шинэчлэх
export const updateHomeContent = (data) => axiosInstance.put("/home", data);

// ✅ Зураг байршуулах — File эсвэл FormData аль алиныг дэмжинэ,
//    ХАРИУ ирмэгц relative болгон буцаана
export const uploadHomeImage = (data) => {
  let formData = data;
  if (!(data instanceof FormData)) {
    formData = new FormData();
    formData.append("image", data);
  }
  return axiosInstance
    .post("/home/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      // backend { url: "..." } гэж буцаана гэж үзэж байна
      const raw = res?.data?.url ?? res?.data?.data?.url ?? "";
      return { url: toRelative(raw) };
    });
};
