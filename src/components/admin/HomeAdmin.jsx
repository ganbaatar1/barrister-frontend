import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getHomeContent,
  updateHomeContent,
  uploadHomeImage,
} from "../../api/home";
import toast from "react-hot-toast";
import quillModules from "../../utils/quillModules";
import quillFormats from "../../utils/quillFormats";

function HomeAdmin() {
  const [formData, setFormData] = useState({
    about: "",
    mission: "",
    vision: "",
    principles: "",
    services: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            images: res.data.images || [],
          }));
        }
      } catch (err) {
        toast.error("Мэдээлэл татахад алдаа гарлаа");
      }
    };
    fetchData();
  }, []);

  const handleQuillChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = [];

    try {
      for (const file of files) {
        const { url } = await uploadHomeImage(file);
        uploaded.push({ url, caption: "" });
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
    } catch (error) {
      toast.error("Зураг байршуулахад алдаа гарлаа");
    }
  };

  const handleCaptionChange = (index, caption) => {
    const updatedImages = [...formData.images];
    updatedImages[index].caption = caption;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleImageDelete = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await updateHomeContent(formData);

      if (res.status === 200) {
        toast.success("Амжилттай хадгалагдлаа");
        const refreshed = await getHomeContent();
        setFormData((prev) => ({
          ...prev,
          ...refreshed.data,
          images: refreshed.data.images || [],
        }));
      } else {
        toast.error("Серверээс алдаатай хариу ирлээ");
      }
    } catch (err) {
      console.error("❌ Хадгалах алдаа:", err);
      toast.error("Хадгалах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Нүүр хуудасны агуулга удирдах</h2>

      <div className="space-y-4">
        <label className="font-semibold">Нүүр зургууд (Slideshow)</label>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        {formData.images.map((img, index) => (
          <div
            key={index}
            className="mt-4 flex flex-col sm:flex-row items-start gap-4 border p-2 rounded shadow-sm bg-gray-50"
          >
            <img
              src={img.url}
              alt={`Banner ${index}`}
              className="w-40 h-24 object-cover rounded border"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Тайлбар</label>
              <input
                type="text"
                value={img.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Тайлбар бичих..."
              />
            </div>
            <button
              onClick={() => handleImageDelete(index)}
              className="text-red-600 font-bold hover:underline"
            >
              Устгах
            </button>
          </div>
        ))}

        <div>
          <label className="font-semibold">Бидний тухай</label>
          <ReactQuill
            value={formData.about}
            onChange={(val) => handleQuillChange("about", val)}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>

        <div>
          <label className="font-semibold">Эрхэм зорилго</label>
          <ReactQuill
            value={formData.mission}
            onChange={(val) => handleQuillChange("mission", val)}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>

        <div>
          <label className="font-semibold">Алсын хараа</label>
          <ReactQuill
            value={formData.vision}
            onChange={(val) => handleQuillChange("vision", val)}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>

        <div>
          <label className="font-semibold">Үндсэн зарчим</label>
          <ReactQuill
            value={formData.principles}
            onChange={(val) => handleQuillChange("principles", val)}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>

        <div>
          <label className="font-semibold">Үйлчилгээний чиглэлүүд</label>
          <ReactQuill
            value={formData.services}
            onChange={(val) => handleQuillChange("services", val)}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
