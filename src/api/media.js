// src/api/media.js
import axios from "./axiosInstance";

export async function uploadMedia({ files, section = "common", caption = "", alt = "" }) {
  const form = new FormData();
  for (const f of files) form.append("files", f);
  form.append("section", section);
  if (caption) form.append("caption", caption);
  if (alt) form.append("alt", alt);

  // ⚠️ Content-Type-ийг ГАРААР бүү тавь — axios өөрөө boundary үүсгэнэ
  const { data } = await axios.post("/media/upload", form);
  return data.items; // [{url, public_id, resource_type, ...}]
}
