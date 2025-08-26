// 📁 src/utils/cloudinary.js
const CLOUD = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;      // ж: djam1etvx
const PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;  // ж: barrister_unsigned
const DEFAULT_FOLDER = process.env.REACT_APP_CLOUDINARY_FOLDER || "barrister";

/**
 * Cloudinary руу UNSIGNED upload
 * @param {File|Blob|string} file - File/Blob эсвэл http(s)/data: URL
 * @param {string} folder
 * @param {number} timeoutMs - default 25s
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function cloudinaryUpload(file, folder = DEFAULT_FOLDER, timeoutMs = 25000) {
  if (!CLOUD || !PRESET) {
    throw new Error("Cloudinary ENV тохиргоо дутуу байна (cloud name / upload preset).");
  }
  if (!file) throw new Error("Upload хийх файл хоосон байна.");

  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
  const fd = new FormData();

  // File/Blob эсвэл string (http/https/data:) хоёуланг нь дэмжинэ
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  if (folder) fd.append("folder", folder);

  // Сонголт: илүү цэгцтэй public filename хүсвэл preset дээрээ зөвшөөрөөд:
  // fd.append("use_filename", "true");
  // fd.append("unique_filename", "true");

  // Сонголт: alt (SEO)
  try {
    const name = typeof file === "object" && "name" in file ? file.name : "image";
    fd.append("context", `alt=${name}`);
  } catch (_) {}

  // Timeout хамгаалалт
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);

  let res, json;
  try {
    res = await fetch(url, { method: "POST", body: fd, signal: ac.signal });
  } catch (netErr) {
    clearTimeout(t);
    // fetch өөрөө унах (сүлжээ тасарсан, abort, гэх мэт)
    throw new Error(`Сүлжээний алдаа/таймаут: ${netErr?.message || netErr}`);
  } finally {
    clearTimeout(t);
  }

  // Cloudinary ихэнхдээ JSON буцаадаг — эхлээд JSON уншаад, болохгүй бол text
  try {
    json = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`Cloudinary upload алдаа: ${res.status} ${text || ""}`);
    // OK мөртлөө JSON биш ирвэл text-г буцаахгүй, багцлаад өгье
    return { secure_url: "", public_id: "", raw: text };
  }

  if (!res.ok) {
    // Түгээмэл: Invalid upload preset / Missing file / Invalid Signature
    const msg = json?.error?.message || `Upload failed (${res.status})`;
    throw new Error(msg);
  }

  return json; // { asset_id, public_id, secure_url, ... }
}

// Ашигтай жижиг шалгалт
export const isCloudinaryUrl = (u = "") => /^https?:\/\/res\.cloudinary\.com\//i.test(u);
