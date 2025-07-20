import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createNews,
  deleteNews,
  getAllNews,
  updateNews,
} from "../../api/news";
import quillModules from "../../utils/quillModules";
import quillFormats from "../../utils/quillFormats";

function NewsAdmin() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    date: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await getAllNews();
      setNewsList(res.data || []);
    } catch (err) {
      console.error("❌ Мэдээ татах алдаа:", err);
      toast.error("Мэдээ ачааллахад алдаа гарлаа");
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      date: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setImageFile(null);
    setPreview("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // 📝 Add all form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // 🖼 Add image if available
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingId) {
        await updateNews(editingId, formData);
        toast.success("Мэдээ амжилттай шинэчлэгдлээ");
      } else {
        await createNews(formData);
        toast.success("Мэдээ амжилттай нэмэгдлээ");
      }

      resetForm();
      fetchNews();
    } catch (err) {
      console.error("❌ Хадгалах алдаа:", err);
      toast.error("Хадгалах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      content: item.content || "",
      date: item.date?.split("T")[0] || "",
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || "",
      seoKeywords: item.seoKeywords || "",
    });
    setEditingId(item._id);
    setImageFile(null);
    setPreview(
      item.image?.startsWith("http")
        ? item.image
        : `http://localhost:5050${item.image}`
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Та энэ мэдээг устгахдаа итгэлтэй байна уу?")) return;
    try {
      await deleteNews(id);
      toast.success("Мэдээ амжилттай устгалаа");
      fetchNews();
    } catch (err) {
      console.error("❌ Устгах алдаа:", err);
      toast.error("Устгах үед алдаа гарлаа");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Мэдээ засварлах" : "Шинэ мэдээ нэмэх"}
      </h2>

      <div className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Гарчиг"
          className="w-full p-2 border rounded"
        />

        <ReactQuill
          value={form.content}
          onChange={(val) => handleInputChange("content", val)}
          modules={quillModules}
          formats={quillFormats}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={form.seoTitle}
          onChange={(e) => handleInputChange("seoTitle", e.target.value)}
          placeholder="SEO гарчиг"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={form.seoDescription}
          onChange={(e) => handleInputChange("seoDescription", e.target.value)}
          placeholder="SEO тайлбар"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={form.seoKeywords}
          onChange={(e) => handleInputChange("seoKeywords", e.target.value)}
          placeholder="SEO түлхүүр үгс (таслалаар)"
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Шинэчлэх" : "Хадгалах"}
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Цэвэрлэх
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2">Бүх мэдээнүүд:</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {newsList.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded bg-white shadow flex flex-col justify-between"
          >
            <h4 className="font-bold mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-2">
              {item.date?.split("T")[0]}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:underline"
              >
                Засах
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:underline"
              >
                Устгах
              </button>
            </div>
            <div className="flex justify-end gap-4 mt-2">
  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=https://barrister.mn/news/${item._id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline text-sm"
  >
    Facebook
  </a>
  <a
    href={`https://twitter.com/intent/tweet?url=https://barrister.mn/news/${item._id}&text=${encodeURIComponent(item.title)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sky-500 hover:underline text-sm"
  >
    Twitter
  </a>
  <a
    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://barrister.mn/news/${item._id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-800 hover:underline text-sm"
  >
    LinkedIn
  </a>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsAdmin;
