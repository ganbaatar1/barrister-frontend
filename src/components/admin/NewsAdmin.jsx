// 📁 src/components/admin/NewsAdmin.jsx
import { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../../api/news";

import { cloudinaryUpload } from "../../utils/cloudinary";

// Quill тохиргоо (хүсвэл тусдаа файл руу гаргаж болно)
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "link",
];

export default function NewsAdmin() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // form state
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "", // Cloudinary secure_url хадгална
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isEdit = useMemo(() => Boolean(editingId), [editingId]);

  // жагсаалт татах
  const fetchList = async () => {
    setLoadingList(true);
    try {
      const res = await getNews();
      const data = Array.isArray(res?.data) ? res.data : [];
      setItems(data);
    } catch (e) {
      console.error(e);
      toast.error("Мэдээ татахад алдаа гарлаа");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // форм контрол
  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", content: "", image: "" });
  };

  // Cloudinary руу зураг байршуулах
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const c = await cloudinaryUpload(file, "news"); // /barrister/news фолдер (ENV-д тохирсон)
      setField("image", c.secure_url);
      toast.success("Зураг Cloudinary-д байршууллаа");
    } catch (err) {
      console.error(err);
      toast.error("Зураг байршуулалт амжилтгүй");
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  // засах горимд form-ыг дүүргэх
  const startEdit = async (id) => {
    try {
      const res = await getNewsById(id);
      const d = res?.data || {};
      setEditingId(id);
      setForm({
        title: d.title || "",
        content: d.content || "",
        image: d.image || "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
      toast.error("Мэдээ дуудах алдаа");
    }
  };

  // устгах
  const onDelete = async (id) => {
    if (!window.confirm("Энэ мэдээг устгах уу?")) return;
    try {
      await deleteNews(id);
      toast.success("Устгагдлаа");
      // жагсаалтаа дахин татна
      fetchList();
      // яг энэ мэдээг засаж байсан бол form-оо reset
      if (editingId === id) resetForm();
    } catch (e) {
      console.error(e);
      toast.error("Устгах үед алдаа гарлаа");
    }
  };

  // хадгалах (шинэ/засвар)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      toast.error("Гарчиг хоосон байна");
      return;
    }
    if (!form.content?.trim()) {
      toast.error("Агуулга хоосон байна");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateNews(editingId, form);
        toast.success("Мэдээ шинэчлэгдлээ");
      } else {
        await createNews(form);
        toast.success("Шинэ мэдээ нэмэгдлээ");
      }
      resetForm();
      fetchList();
    } catch (e2) {
      console.error(e2);
      toast.error("Хадгалах үед алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* ФОРМ */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">
            {isEdit ? "Мэдээ засах" : "Шинэ мэдээ нэмэх"}
          </h2>
          {isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-blue-600 hover:underline"
            >
              + Шинээр үүсгэх горим руу
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Гарчиг */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Гарчиг</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Гарчиг"
              required
            />
          </div>

          {/* Зураг */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">
              Нүүр зураг (cover)
            </label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
            {uploading && (
              <p className="text-xs text-gray-500">Байршуулж байна…</p>
            )}
            {form.image && (
              <img
                src={form.image}
                alt="cover"
                className="w-48 h-28 object-cover rounded border"
              />
            )}
          </div>

          {/* Агуулга */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Агуулга</label>
            <ReactQuill
              value={form.content}
              onChange={(v) => setField("content", v)}
              modules={quillModules}
              formats={quillFormats}
              theme="snow"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
          >
            {saving ? "Хадгалж байна…" : isEdit ? "Шинэчлэх" : "Нэмэх"}
          </button>
        </div>
      </form>

      {/* ЖАГСААЛТ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Нийт мэдээнүүд</h3>
          <button
            type="button"
            onClick={fetchList}
            className="text-sm text-gray-600 hover:underline"
          >
            Дахин ачаалах
          </button>
        </div>

        {loadingList ? (
          <p className="text-gray-500">Ачаалж байна…</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">Одоогоор мэдээ алга.</p>
        ) : (
          <ul className="divide-y">
            {items.map((n) => (
              <li key={n._id} className="py-3 flex items-start gap-4">
                <img
                  src={n.image || ""}
                  alt={n.title || "news"}
                  className="w-24 h-16 object-cover rounded border bg-gray-50"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{n.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {(n.content || "").replace(/<[^>]+>/g, " ").trim()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(n._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => onDelete(n._id)}
                    className="text-red-600 hover:underline"
                  >
                    Устгах
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
