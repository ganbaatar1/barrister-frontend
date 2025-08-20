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

  // ---- ТӨХӨӨРӨМЖ АЧААЛЛАХ ----
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getHomeContent();
        const d = res?.data || {};
        // Backend хуучин байж болно (single image) → нийцүүлэх
        let images = [];
        if (Array.isArray(d.images) && d.images.length) {
          images = d.images
            .filter(Boolean)
            .map((x) => (typeof x === "string" ? { url: x, caption: "" } : { url: x.url, caption: x.caption || "" }))
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

  // ---- ТАЛБАР ТОГТООХ ----
  const setField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  // ---- CLOUDINARY UPLOAD ----
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const f of files) {
        const c = await cloudinaryUpload(f, "home"); // Cloudinary → /barrister/home
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

  // ---- ХАДГАЛАХ ----
  const handleSave = async () => {
    setSaving(true);
    try {
      // Backend нийцтэй payload (шинэ images[], хуучин image)
      const images = (formData.images || []).map((x) => ({ url: x.url, caption: x.caption || "" }));
      const payload = {
        about: formData.about,
        mission: formData.mission,
        vision: formData.vision,
        principles: formData.principles,
        services: formData.services,
        images,
        image: images[0]?.url || "", // single талбар руу эхнийхийг давхар өгнө (backward compat)
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

  return
