// 📁 src/utils/cloudinary.js
const CLOUD = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;        // ж: djam1etvx
const PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;    // ж: barrister_unsigned
const DEFAULT_FOLDER = process.env.REACT_APP_CLOUDINARY_FOLDER || "barrister";

/**
 * Cloudinary руу unsigned upload хийж, { secure_url, public_id, ... } буцаана
 * @param {File|Blob|string} file
 * @param {string} folder
 * @returns {Promise<Object>}
 */
export async function cloudinaryUpload(file, folder = DEFAULT_FOLDER) {
  if (!CLOUD || !PRESET) {
    throw new Error("Cloudinary ENV тохиргоо дутуу байна (cloud name / upload preset).");
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  if (folder) fd.append("folder", folder);
  // (сонголт) SEO-д: alt context
  try { fd.append("context", `alt=${(file && file.name) || "image"}`); } catch (_) {}

  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload алдаа: ${res.status} ${t}`);
  }
  return res.json();
}

// (сонголттой) шалгах utility
export const isCloudinaryUrl = (u = "") =>
  /^https?:\/\/res\.cloudinary\.com\//i.test(u);
