import { useEffect, useState } from "react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../api/testimonial";
import { toast } from "react-toastify";
import { uploadMedia } from "../../api/media";

// /uploads (локал dev) болон бүрэн URL (Cloudinary)-ыг зөв харуулах жижиг туслагч
function resolveImageUrl(u) {
  if (!u) return "";
  const raw = typeof u === "string" ? u : u.url;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;            // Cloudinary эсвэл бүрэн URL
  if (raw.startsWith("/uploads")) return `http://localhost:5050${raw}`; // backend static
  if (raw.startsWith("uploads")) return `http://localhost:5050/${raw}`;
  return raw;
}

function TestimonialAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    image: "",    // Cloudinary url (string) эсвэл хоосон
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setTestimonials(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Сэтгэгдлийг татаж чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Зургийг серверээр дамжуулан Cloudinary-д байршуулна
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // түр preview (local blob) харуулж болно
      setPreviewImage(URL.createObjectURL(file));

      const [m] = await uploadMedia({ files: [file], section: "testimonials" }); // {url, public_id, ...}
      setFormData((p) => ({ ...p, image: m.url }));
      setPreviewImage(m.url); // Cloudinary-ийн бодит URL-руу шилжүүлье
      toast.success("Зураг Cloudinary-д байршууллаа");
    } catch (err) {
      console.error(err);
      toast.error("Зураг байршуулалт амжилтгүй");
      setPreviewImage(null);
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.message) {
        toast.error("Нэр болон сэтгэгдэл шаардлагатай");
        return;
      }

      // ✨ JSON payload илгээнэ — image нь Cloudinary URL (string)
      const payload = {
        name: formData.name,
        message: formData.message,
        image: formData.image || "", // хоосон байж болно
      };

      if (editId) {
        await updateTestimonial(editId, payload);
        toast.success("Сэтгэгдэл шинэчлэгдлээ");
      } else {
        await createTestimonial(payload);
        toast.success("Шинэ сэтгэгдэл нэмэгдлээ");
      }

      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Хадгалах үед алдаа гарлаа");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", message: "", image: "" });
    setPreviewImage(null);
    setEditId(null);
    setUploading(false);
  };

  const handleEdit = (item) => {
    const img = typeof item.image === "string" ? item.image : item.image?.url || "";
    setFormData({
      name: item.name || "",
      message: item.message || "",
      image: img,
    });
    setPreviewImage(resolveImageUrl(img) || null);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Та энэ сэтгэгдлийг устгах уу?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Сэтгэгдэл устгалаа");
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Устгах үед алдаа гарлаа");
    }
  };

  const removeImage = () => {
    setFormData((p) => ({ ...p, image: "" }));
    setPreviewImage(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Сэтгэгдэл удирдлага</h2>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="name"
          placeholder="Нэр"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-2 border rounded w-full"
        />
        <textarea
          name="message"
          placeholder="Сэтгэгдэл"
          value={formData.message}
          onChange={handleChange}
          required
          className="p-2 border rounded w-full"
        />

        <div className="space-y-2">
          <input
            type="file"
            name="image"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="p-2 border rounded w-full"
          />
          {uploading && <p className="text-xs text-gray-500">Зураг байршуулж байна…</p>}
          {previewImage && (
            <div className="flex items-center gap-3">
              <img src={previewImage} alt="Preview" className="max-h-32 mt-1 rounded shadow" />
              <button type="button" onClick={removeImage} className="text-red-600">
                Зураг арилгах
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={uploading}>
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>
      </form>

      <h3 className="text-lg font-bold">Нийт сэтгэгдэл</h3>

      {loading ? (
        <p className="text-gray-500">Ачаалж байна…</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t) => {
            const img = resolveImageUrl(t.image);
            return (
              <div key={t._id} className="bg-white dark:bg-gray-800 border p-4 rounded shadow space-y-2">
                <p className="text-lg font-semibold">{t.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.message}</p>
                {img ? (
                  <img
                    src={img}
                    alt={t.name}
                    className="h-24 w-24 object-cover rounded-full"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : null}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleEdit(t)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Засах
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Устгах
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TestimonialAdmin;
