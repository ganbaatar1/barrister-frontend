// src/components/admin/TestimonialAdmin.jsx
import { useEffect, useState } from "react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../api/testimonial";
import { toast } from "react-toastify";
import { uploadMedia } from "../../api/media";

// /uploads болон бүрэн URL-уудыг зөв харуулах
function resolveImageUrl(u) {
  if (!u) return "";
  const raw = typeof u === "string" ? u : u.url;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw; // Cloudinary
  return raw; // шаардлагатай бол API_BASE-г нэмэх боломжтой
}

function TestimonialAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    isOrganization: false,
    name: "",
    organization: "",
    message: "",
    occupation: "",
    image: "",   // хувь хүний зураг
    orgLogo: "", // байгууллагын лого
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setTestimonials(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Сэтгэгдлийг татаж чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  // Хувь хүний зураг upload → Cloudinary
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const [m] = await uploadMedia({ files: [file], section: "testimonials" });
      setFormData((p) => ({ ...p, image: m.url }));
      toast.success("Зураг байршууллаа");
    } catch (err) {
      console.error(err);
      toast.error("Зураг байршуулалт амжилтгүй");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Байгууллагын лого upload → Cloudinary
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const [m] = await uploadMedia({ files: [file], section: "testimonials" });
      setFormData((p) => ({ ...p, orgLogo: m.url }));
      toast.success("Лого байршууллаа");
    } catch (err) {
      console.error(err);
      toast.error("Лого байршуулалт амжилтгүй");
    } finally {
      setUploadingLogo(false);
    }
  };

  const resetForm = () => {
    setFormData({
      isOrganization: false,
      name: "",
      organization: "",
      message: "",
      occupation: "",
      image: "",
      orgLogo: "",
    });
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      isOrganization: !!item.isOrganization,
      name: item.name || "",
      organization: item.organization || "",
      message: item.message || "",
      occupation: item.occupation || "",
      image: item.photo || "",
      orgLogo: item.orgLogo || "",
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // multipart payload (файл байхгүй ч текст талбарууд явна)
      const payload = new FormData();
      payload.set("isOrganization", String(formData.isOrganization));
      payload.set("name", formData.name);
      payload.set("organization", formData.organization);
      payload.set("message", formData.message);
      payload.set("occupation", formData.occupation);

      // Хэрэв файлээр илгээх бол: payload.append("photo", file) гэх мэтээр нэмнэ.

      const fn = editId ? updateTestimonial : createTestimonial;
      await fn(editId || undefined, payload);
      toast.success(editId ? "Шинэчиллээ" : "Амжилттай үүслээ");
      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Хадгалах үед алдаа гарлаа");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={onSubmit} className="space-y-4 border p-4 rounded">
        <div className="flex items-center gap-2">
          <input
            id="isOrganization"
            type="checkbox"
            checked={formData.isOrganization}
            onChange={(e) => setFormData(p => ({ ...p, isOrganization: e.target.checked }))}
          />
          <label htmlFor="isOrganization">Байгууллагыг төлөөлж байна</label>
        </div>

        {formData.isOrganization && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Байгууллагын нэр</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={formData.organization}
                onChange={(e) => setFormData(p => ({ ...p, organization: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-1">Байгууллагын лого</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {uploadingLogo && <div className="text-sm">Лого байршуулж байна…</div>}
              {formData.orgLogo && (
                <img
                  src={resolveImageUrl(formData.orgLogo)}
                  alt={formData.organization || ""}  // decorative бол хоосон alt
                  className="h-16 mt-2 object-contain"
                />
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Нэр</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Албан тушаал/Төрөл</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={formData.occupation}
              onChange={(e) => setFormData(p => ({ ...p, occupation: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Сэтгэгдэл</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={formData.message}
            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
            required
          />
        </div>

        {!formData.isOrganization && (
          <div>
            <label className="block mb-1">Хувь хүний зураг</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {uploadingPhoto && <div className="text-sm">Зураг байршуулж байна…</div>}
            {formData.image && (
              <img
                src={resolveImageUrl(formData.image)}
                alt=""  // thumbnail тул гоёлын зураг — хоосон alt
                className="h-16 mt-2 object-cover rounded"
              />
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Шинэчлэх" : "Нэмэх"}
          </button>
          <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={resetForm}>
            Цэвэрлэх
          </button>
        </div>
      </form>

      {!loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t._id} className="border rounded p-4 space-y-2">
              <div className="flex items-center gap-3">
                {t.isOrganization ? (
                  t.orgLogo ? (
                    <img
                      src={resolveImageUrl(t.orgLogo)}
                      alt={t.organization || ""}   // мэдээлэлгүй бол хоосон alt үлдээнэ
                      className="h-10 object-contain"
                    />
                  ) : null
                ) : (
                  t.photo ? (
                    <img
                      src={resolveImageUrl(t.photo)}
                      alt={t.name || ""}  // "photo/image" гэх үг хэрэглэхгүй
                      className="h-10 w-10 object-cover rounded-full"
                    />
                  ) : null
                )}
                <div className="font-semibold">
                  {t.isOrganization && t.organization ? `${t.organization} — ` : ""}
                  {t.name}
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">{t.message}</div>
              {t.occupation && <div className="text-xs text-gray-500">{t.occupation}</div>}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)} className="bg-amber-500 text-white px-3 py-1 rounded">Засах</button>
                <button onClick={() => handleDelete(t._id)} className="bg-red-600 text-white px-3 py-1 rounded">Устгах</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestimonialAdmin;
