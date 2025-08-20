// 📁 src/api/home.js
// Нүүр хуудасны агуулгын API дуудлагууд
// (Зураг байршуулалтыг одоо Cloudinary-р шийдсэн тул энд upload функцийг хадгалах шаардлагагүй.)

import axiosInstance from "../api/axiosInstance";

/**
 * Нүүр хуудасны агуулга авах
 * GET /home
 * @returns {Promise<import('axios').AxiosResponse>}
 * Response жишээ:
 * {
 *   about: string,
 *   mission: string,
 *   vision: string,
 *   principles?: string,
 *   services?: string,
 *   images: Array<{ url: string, caption?: string }>
 * }
 */
export const getHomeContent = () => axiosInstance.get("/home");

/**
 * Нүүр хуудасны агуулга шинэчлэх
 * PUT /home
 * @param {Object} data
 * @param {string} data.about
 * @param {string} data.mission
 * @param {string} data.vision
 * @param {string} [data.principles]
 * @param {string} [data.services]
 * @param {Array<{ url: string, caption?: string }>} data.images
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const updateHomeContent = (data) => axiosInstance.put("/home", data);
