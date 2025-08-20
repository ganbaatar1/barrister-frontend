// 📁 src/utils/resolveImageUrl.js
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
const STATIC_URL = process.env.REACT_APP_STATIC_URL || "";

// API_BASE = "https://.../api" бол /api-ийг авч үндэс болгож байна
const RAW_BASE = API_BASE ? API_BASE.replace(/\/api\/?$/, "") : STATIC_URL;
// Үндсэн base URL (хоосон байвал production-ийн backend-ийг ашиглая)
const IMAGE_BASE = (RAW_BASE || "https://barrister-backend.onrender.com").replace(/\/$/, "");

// Туслах шалгалтууд
const isCloudinary = (u = "") => /^https?:\/\/res\.cloudinary\.com\//i.test(u);
const isLocalhostHost = (h = "") => h === "localhost" || h === "127.0.0.1";

/**
 * Зургийн URL-ыг production-д аюулгүй болгож хувиргана:
 * - Cloudinary бол шууд буцаана
 * - localhost бол /uploads мөрийг IMAGE_BASE дээр join хийж өөрчилнө
 * - http бол https болгож албадна
 * - relative (/uploads/..) бол IMAGE_BASE дээр join хийнэ
 */
export default function resolveImageUrl(input) {
  if (!input) return ""; // placeholder-гүйгээр зураг рендэрлэхгүй

  try {
    // Абсолют URL
    if (/^https?:\/\//i.test(input)) {
      if (isCloudinary(input)) return input;

      const u = new URL(input);

      // Localhost бол production base-руу шилжүүлье (/uploads-ыг хадгална)
      if (isLocalhostHost(u.hostname)) {
        return `${IMAGE_BASE}${u.pathname}${u.search || ""}${u.hash || ""}`;
      }

      // http → https албадалт (mixed content-оос сэргийлнэ)
      if (u.protocol === "http:") {
        return `https://${u.host}${u.pathname}${u.search || ""}${u.hash || ""}`;
      }
      return input;
    }

    // Харьцангуй зам (/uploads/.., uploads/..)
    const path = input.startsWith("/") ? input : `/${input}`;
    return `${IMAGE_BASE}${path}`;
  } catch {
    // URL parse алдаа гарвал энгийн join
    const p = String(input || "");
    if (!p) return "";
    return `${IMAGE_BASE}${p.startsWith("/") ? "" : "/"}${p}`;
  }
}

// Хэрэгцээтэй бол гаднаас ашиглахаар export хийж болно
export { isCloudinary };
