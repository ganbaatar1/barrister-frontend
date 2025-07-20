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
    image: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        if (res.data) {
          setFormData(res.data);
          setPreview(res.data.image || "");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let imageUrl = formData.image || "";

      if (image) {
        const form = new FormData();
        form.append("image", image);
        const res = await uploadHomeImage(form);
        imageUrl = res.data.path;
      }

      const payload = { ...formData, image: imageUrl };
      const res = await updateHomeContent(payload);

      if (res.status === 200) {
        toast.success("Амжилттай хадгалагдлаа");
        const refreshed = await getHomeContent();
        setFormData(refreshed.data);
        setPreview(refreshed.data.image || "");
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
        <label className="font-semibold">Нүүр зураг</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview.startsWith("blob:") ? preview : `http://localhost:5050${preview}`}
            alt="Preview"
            className="max-h-40 mt-2 rounded border shadow"
          />
        )}

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
