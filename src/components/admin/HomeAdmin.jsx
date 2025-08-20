// 📁 src/components/admin/HomeAdmin.jsx
import resolveImageUrl from "../../utils/resolveImageUrl";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getHomeContent, updateHomeContent } from "../../api/home";
import toast from "react-hot-toast";
import quillModules from "../../utils/quillModules";
import quillFormats from "../../utils/quillFormats";
import { cloudinaryUpload } from "../../utils/cloudinary";

const ok2xx = (s) => Number(s) >= 200 && Number(s) < 300;

export default function HomeAdmin() {
  const [formData, setFormData] = useState({
    about: "",
    mission: "",
    vision: "",
    principles: "",
    services: "",
    images: [], // [{ url: "https://...", caption: "" }]
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Агуулга ачаалах
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getHomeContent();
        const d = res?.data || {};
        // Хуучин backend (single image) → нийцүүлэх
        let images = [];
        if (Array.isArray(d.images) && d.images.length) {
          images = d.images
            .filter(Boolean)
            .map((x) =>
              typeof x === "string" ? { url: x, caption: "" } : { url: x.url, caption: x.caption || "" }
            )
            .filter((x) => !!x.url);
        } else if (d.image) {
          images = [{ url: d.image, caption: "" }];
        }

        setFormData({
          about: d.about || "",
          mission: d.mission || "",
          vision: d.vision || "",
          principles: d.principles || "",
          services: d.services || "",
          images,
        });
      } catch (e) {
        console.error(e);
        toast.error("Мэдээлэл татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  // Cloudinary upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const f of files) {
        const c = await cloudinaryUpload(f, "home"); // /barrister/home дотор хадгална
        uploaded.push({ url: c.secure_url, caption: "" });
      }
      setFormData((p) => ({ ...p, images: [...p.images, ...uploaded] }));
      toast.success("Зураг Cloudinary-д нэмэгдлээ");
    } catch (err) {
      console.error(err);
      toast.error("Cloudinary upload амжилтгүй");
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const updateCaption = (i, caption) => {
    setFormData((p) => {
      const next = [...p.images];
      next[i] = { ...next[i], caption };
      return { ...p, images: next };
    });
  };

  const removeImage = (i) => {
    setFormData((p) => {
      const next = [...p.images];
      next.splice(i, 1);
      return { ...p, images: next };
    });
  };

  // Хадгалах
  const handleSave = async () => {
    setSaving(true);
    try {
      const images = (formData.images || []).map((x) => ({ url: x.url, caption: x.caption || "" }));
      const payload = {
        about: formData.about,
        mission: formData.mission,
        vision: formData.vision,
        principles: formData.principles,
        services: formData.services,
        images,
        image: images[0]?.url || "", // хуучин талбар руу эхнийхийг давхар өгнө
      };

      const res = await updateHomeContent(payload);
      if (ok2xx(res?.status)) {
        toast.success("Амжилттай хадгалагдлаа");
      } else {
        toast.error(`Серверээс алдаатай хариу ирлээ (${res?.status || "—"})`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Хадгалах үед алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  // ⛔️ ЧУХАЛ: return ба "(" НЭГ МӨРӨНД
  return (
    <div className="p-6 space-y-6 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Нүүр хуудасны агуулга удирдах</h2>
        <span className="text-sm text-gray-500">
          {loading ? "Ачаалж байна…" : `${formData.images.length} зураг`}
        </span>
      </div>

      {/* Slider images */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="font-semibold">Нүүр зургууд (Slideshow)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          {uploading && <span className="text-sm text-gray-500">Байршуулж байна…</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {formData.images.map((img, i) => {
            const displayUrl = resolveImageUrl(img?.url || "");
            const isDisplayable = !!displayUrl;
            return (
              <div
                key={`${img.url}-${i}`}
                className="flex flex-col sm:flex-row items-start gap-4 border p-2 rounded bg-gray-50"
              >
                {isDisplayable ? (
                  <img
                    src={displayUrl}
                    alt={`Banner ${i}`}
                    className="w-40 h-24 object-cover rounded border bg-white"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement?.insertAdjacentHTML(
                        "afterbegin",
                        '<div class="w-40 h-24 flex items-center justify-center bg-yellow-50 text-yellow-800 text-xs text-center px-2 rounded border">Re-upload required</div>'
                      );
                    }}
                  />
                ) : (
                  <div className="w-40 h-24 flex items-center justify-center bg-yellow-50 text-yellow-800 text-xs text-center px-2 rounded border">
                    Re-upload required
                  </div>
                )}

                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium mb-1">Тайлбар</label>
                  <input
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Тайлбар бичих…"
                    value={img.caption || ""}
                    onChange={(e) => updateCaption(i, e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Устгах
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500">
          * Production дээр зөвхөн Cloudinary (`https://res.cloudinary.com/...`) эсвэл backend HTTPS (`/uploads` → бүрэн HTTPS) линкүүд л найдвартай харагдана.
          Localhost линк илэрвэл “Re-upload required” гэж анхааруулна.
        </p>
      </div>

      {/* Rich text талбарууд */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">Бидний тухай</label>
          <ReactQuill
            value={formData.about}
            onChange={(v) => setField("about", v)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        </div>
        <div>
          <label className="font-semibold">Эрхэм зорилго</label>
          <ReactQuill
            value={formData.mission}
            onChange={(v) => setField("mission", v)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        </div>
        <div>
          <label className="font-semibold">Алсын хараа</label>
          <ReactQuill
            value={formData.vision}
            onChange={(v) => setField("vision", v)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        </div>
        <div>
          <label className="font-semibold">Үндсэн зарчим</label>
          <ReactQuill
            value={formData.principles}
            onChange={(v) => setField("principles", v)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">Үйлчилгээний чиглэлүүд</label>
          <ReactQuill
            value={formData.services}
            onChange={(v) => setField("services", v)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Хадгалж байна…" : "Хадгалах"}
          </button>
        </div>
      </div>
    </div>
  );
}
