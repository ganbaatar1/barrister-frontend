import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import defaultImg from "../../assets/default-profile.png";
import { uploadMedia } from "../../api/media";

const API_BASE = "/lawyers";

// 🤝 local uploads болон cloudinary хоёрыг хоёуланг нь дэмжих resolver
function resolvePhotoUrl(val) {
  const raw = typeof val === "string" ? val : val?.url;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;          // Cloudinary эсвэл бусад бүрэн URL
  if (raw.startsWith("/")) return `http://localhost:5050${raw}`; // локал dev backend
  return raw;
}

function LawyersAdmin() {
  const [lawyers, setLawyers] = useState([]);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    specialization: "",
    languages: "",
    academicDegree: "",
    experience: "",
    startDate: "",
    status: "ажиллаж байгаа",
    // энд URL эсвэл {url, public_id, resource_type}
    profilePhoto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axiosInstance.get(API_BASE);
      setLawyers(res.data || []);
    } catch {
      toast.error("Хуульчдын мэдээллийг татаж чадсангүй");
    }
  };

  const resetForm = () => {
    setFormData({
      lastName: "",
      firstName: "",
      specialization: "",
      languages: "",
      academicDegree: "",
      experience: "",
      startDate: "",
      status: "ажиллаж байгаа",
      profilePhoto: null,
    });
    setPreviewImage(null);
    setEditingId(null);
    setUploading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ Профайл зураг Cloudinary руу серверээр дамжуулж байршуулна
  const onSelectProfilePhoto = async (e) => {
    const file = (e.target.files || [])[0];
    if (!file) return;
    setUploading(true);
    try {
      // түр preview
      setPreviewImage(URL.createObjectURL(file));
      // Cloudinary upload (/api/media/upload)
      const [m] = await uploadMedia({ files: [file], section: "lawyers" });
      // form-д Cloudinary-ийн URL-г хадгална (schema-даа string байлаа ч OK)
      setFormData((p) => ({
        ...p,
        profilePhoto: { url: m.url, public_id: m.public_id, resource_type: m.resource_type },
      }));
      toast.success("Профайл зураг байршууллаа");
    } catch (err) {
      console.error(err);
      toast.error("Зураг байршуулж чадсангүй");
      // preview-г буцааж арилгая
      setPreviewImage(null);
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const toArray = (str) =>
    (str || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        lastName: formData.lastName,
        firstName: formData.firstName,
        specialization: toArray(formData.specialization),
        languages: toArray(formData.languages),
        academicDegree: formData.academicDegree,
        experience: formData.experience,
        startDate: formData.startDate,
        status: formData.status,
        // ⬇️ backend-ийн хуучин schema нь string байсан ч Cloudinary URL-г өгөхөд ажиллана
        profilePhoto:
          typeof formData.profilePhoto === "string"
            ? formData.profilePhoto
            : formData.profilePhoto?.url || null,
        // хүсвэл бүх media object-оо илгээж болно (backend дэмжиж байвал):
        // profileMedia: formData.profilePhoto,
      };

      if (editingId) {
        await axiosInstance.put(`${API_BASE}/${editingId}`, payload);
        toast.success("Амжилттай засварлалаа");
      } else {
        await axiosInstance.post(API_BASE, payload);
        toast.success("Амжилттай нэмэгдлээ");
      }

      fetchLawyers();
      resetForm();
    } catch (err) {
      toast.error(`Хадгалах үед алдаа гарлаа: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleEdit = (lawyer) => {
    setFormData({
      lastName: lawyer.lastName || "",
      firstName: lawyer.firstName || "",
      specialization: Array.isArray(lawyer.specialization) ? lawyer.specialization.join(", ") : (lawyer.specialization || ""),
      languages: Array.isArray(lawyer.languages) ? lawyer.languages.join(", ") : (lawyer.languages || ""),
      academicDegree: lawyer.academicDegree || "",
      experience: lawyer.experience || "",
      startDate: lawyer.startDate ? lawyer.startDate.split("T")[0] : "",
      status: lawyer.status || "ажиллаж байгаа",
      profilePhoto: lawyer.profilePhoto || null, // string эсвэл object аль нь ч байж болно
    });
    setPreviewImage(resolvePhotoUrl(lawyer.profilePhoto) || null);
    setEditingId(lawyer._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Устгах уу?")) return;
    try {
      await axiosInstance.delete(`${API_BASE}/${id}`);
      toast.success("Амжилттай устгалаа");
      fetchLawyers();
    } catch {
      toast.error("Устгах үед алдаа гарлаа");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Хуульчийн мэдээлэл {editingId ? "(Засаж байна)" : ""}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Овог" required />
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Нэр" required />
        <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Мэргэшил (таслалаар)" />
        <input name="languages" value={formData.languages} onChange={handleChange} placeholder="Хэл (таслалаар)" />
        <input name="academicDegree" value={formData.academicDegree} onChange={handleChange} placeholder="Боловсролын зэрэг" />
        <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Туршлага" />
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ажиллаж байгаа">Ажиллаж байгаа</option>
          <option value="амарч байгаа">Амарч байгаа</option>
          <option value="ажлаас гарсан">Ажлаас гарсан</option>
        </select>

        <div className="flex items-center gap-3">
          <input type="file" name="profilePhoto" accept="image/*,video/*" onChange={onSelectProfilePhoto} />
          {uploading && <span className="text-xs text-gray-500">Зураг байршуулж байна…</span>}
        </div>

        <img
          src={previewImage || defaultImg}
          alt="preview"
          className="w-24 h-24 object-cover rounded-full"
        />

        <div className="col-span-full flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={uploading}>
            Хадгалах
          </button>
          <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">
            Цэвэрлэх
          </button>
        </div>
      </form>

      <h3 className="text-lg font-semibold mt-6 mb-2">Бүртгэлтэй хуульчид:</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {lawyers.map((l) => {
          const photo = resolvePhotoUrl(l.profilePhoto);
          return (
            <div key={l._id} className="border p-4 rounded shadow">
              <img
                src={photo || defaultImg}
                alt="Профайл"
                className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                onError={(e) => (e.currentTarget.src = defaultImg)}
              />
              <p className="font-semibold">
                {l.lastName} {l.firstName}
              </p>
              <p>{l.academicDegree}</p>
              {l.startDate && (
                <p className="text-sm text-gray-500">
                  {new Date(l.startDate).getFullYear()} оноос хойш
                </p>
              )}
              <div className="mt-2 flex justify-between">
                <button onClick={() => handleEdit(l)} className="text-blue-600">Засах</button>
                <button onClick={() => handleDelete(l._id)} className="text-red-600">Устгах</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LawyersAdmin;
