import { useEffect, useState } from "react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../api/testimonial";
import { toast } from "react-toastify";

const BASE_UPLOAD_URL = process.env.REACT_APP_API_BASE_URL + "/uploads/";

function TestimonialAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await getTestimonials();
      setTestimonials(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Сэтгэгдлийг татаж чадсангүй");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewImage(file ? URL.createObjectURL(file) : null);
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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("message", formData.message);
      if (formData.image) data.append("image", formData.image);

      if (editId) {
        await updateTestimonial(editId, data);
        toast.success("Сэтгэгдэл шинэчлэгдлээ");
      } else {
        await createTestimonial(data);
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
    setFormData({ name: "", message: "", image: null });
    setPreviewImage(null);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      message: item.message,
      image: null, // reset file input
    });
    setPreviewImage(item.image ? BASE_UPLOAD_URL + item.image : null);
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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Сэтгэгдэл удирдлага</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 bg-white p-4 rounded shadow"
      >
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
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded w-full"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-32 mt-2 rounded shadow"
          />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Шинэчлэх" : "Нэмэх"}
        </button>
      </form>

      <h3 className="text-lg font-bold">Нийт сэтгэгдэл</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className="bg-white dark:bg-gray-800 border p-4 rounded shadow space-y-2"
          >
            <p className="text-lg font-semibold">{t.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t.message}
            </p>
            {t.image && (
              <img
                src={
                  t.image.startsWith("http")
                    ? t.image
                    : BASE_UPLOAD_URL + t.image
                }
                alt={t.name}
                className="h-24 w-24 object-cover rounded-full"
              />
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(t)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Засах
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Устгах
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestimonialAdmin;
