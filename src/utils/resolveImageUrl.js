// 📁 src/utils/resolveImageUrl.js
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
const STATIC_URL = process.env.REACT_APP_STATIC_URL || "";

// API_BASE === ".../api" бол "/api"-г авч STATIC URL base болгоно, төгсгөлийн "/"-г арилгана
const IMAGE_BASE = (API_BASE ? API_BASE.replace(/\/api\/?$/, "") : STATIC_URL).replace(/\/$/, "");

export default function resolveImageUrl(input) {
  if (!input) return "/default-image.jpg";
  try {
    // Absolute URL уу?
    if (/^https?:\/\//i.test(input)) {
      const u = new URL(input);
      // localhost/127.0.0.1 байвал продын base руу нормчлох
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        return `${IMAGE_BASE}${u.pathname}`;
      }
      return input;
    }
    // Relative path
    return `${IMAGE_BASE}${input.startsWith("/") ? "" : "/"}${input}`;
  } catch {
    return `${IMAGE_BASE}${input.startsWith("/") ? "" : "/"}${input}`;
  }
}
