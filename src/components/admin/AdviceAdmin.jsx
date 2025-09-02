import React, { useState, useEffect } from "react";
import api from "../../api/advice";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import { toast } from "react-toastify";
import { uploadMedia } from "../../api/media";

function normalizeMedia(x) {
  if (!x) return null;
  if (typeof x === "string") return { url: x, caption: "", public_id: undefined, resource_type: "image" };
  return {
    url: x.url,
    caption: x.caption || "",
    public_id: x.public_id,
    resource_type: x.resource_type || "image",
  };
}
function normalizeGallery(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(Boolean)
    .map((m) => (typeof m === "string" ? { url: m, caption: "", public_id: undefined, resource_type: "image" } : m));
}
function packMediaForSave(m) {
  if (!m) return null;
  return {
    url: m.url,
    caption: m.caption || "",
    public_id: m.public_id,
    resource_type: m.resource_type,
  };
}
function packGalleryForSave(arr = []) {
  return arr.map((m) => packMediaForSave(m));
}

function AdviceAdmin() {
  const [advices, setAdvices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [currentAdvice, setCurrentAdvice] = useState({
    title: "",
    description: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    cover: null,      // {url, caption, public_id?, resource_type?}
    gallery: [],      // [{url, caption, public_id?, resource_type?}]
  });

  useEffect(() => {
    loadAdvices();
  }, []);

  const loadAdvices = async () => {
    try {
      const res = await api.getAdvice(); // хүлээлт: { data: [...] }
      setAdvices(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Зөвлөгөө татаж чадсангүй");
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (!currentAdvice.title || !currentAdvice.content) {
        toast.warn("Гарчиг болон агуулга шаардлагатай");
        return;
      }

      // медиа-г серверт ойлгомжтой байдлаар бэлдье
      const payload = {
        title: currentAdvice.title,
        description: currentAdvice.description,
        content: currentAdvice.content,
        seoTitle: currentAdvice.seoTitle,
        seoDescription: currentAdvice.seoDescription,
        seoKeywords: currentAdvice.seoKeywords,
        cover: packMediaForSave(currentAdvice.cover),
        gallery: packGalleryForSave(currentAdvice.gallery),
      };

      if (currentAdvice._id) {
        await api.updateAdvice(currentAdvice._id, payload);
        toast.success("Амжилттай шинэчлэгдлээ");
      } else {
        await api.createAdvice(payload);
        toast.success("Амжилттай нэмэгдлээ");
      }

      setShowModal(false);
      setCurrentAdvice({
        title: "",
        description: "",
        content: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        cover: null,
        gallery: [],
      });
      loadAdvices();
    } catch (err) {
      console.error(err);
      toast.error("Хадгалах үед алдаа гарлаа");
    }
  };

  const handleDelete = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    try {
      await api.deleteAdvice(confirmDeleteId);
      toast.success("Амжилттай устгалаа");
      setConfirmDeleteId(null);
      loadAdvices();
    } catch (err) {
      console.error(err);
      toast.error("Устгах үед алдаа гарлаа");
    }
  };

  const openEditModal = async (id) => {
    try {
      const data = await api.getAdviceById(id); // хүлээлт: data объект шууд
      if (!data) throw new Error("Мэдээлэл олдсонгүй");
      setCurrentAdvice({
        ...data,
        cover: normalizeMedia(data.cover),
        gallery: normalizeGallery(data.gallery),
      });
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Зөвлөгөө ачаалахад алдаа гарлаа");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAdvice((p) => ({ ...p, [name]: value || "" }));
  };

  // ---- Cloudinary upload (server-side: /api/media/upload) ----
  const onCoverSelect = async (e) => {
    const f = (e.target.files || [])[0];
    if (!f) return;
    setUploadingCover(true);
    try {
      const [m] = await uploadMedia({ files: [f], section: "advice" }); // {url, public_id, resource_type,...}
      setCurrentAdvice((p) => ({
        ...p,
        cover: { url: m.url, caption: p.cover?.caption || "", public_id: m.public_id, resource_type: m.resource_type },
      }));
      toast.success("Cover зураг нэмэгдлээ");
    } catch (err) {
      console.error(err);
      toast.error("Cover upload амжилтгүй");
    } finally {
      e.target.value = "";
      setUploadingCover(false);
    }
  };

  const removeCover = () => {
    setCurrentAdvice((p) => ({ ...p, cover: null }));
  };

  const onGallerySelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const items = await uploadMedia({ files, section: "advice" });
      const mapped = items.map((m) => ({
        url: m.url,
        caption: "",
        public_id: m.public_id,
        resource_type: m.resource_type,
      }));
      setCurrentAdvice((p) => ({ ...p, gallery: [...(p.gallery || []), ...mapped] }));
      toast.success("Зураг(ууд) нэмэгдлээ");
    } catch (err) {
      console.error(err);
      toast.error("Gallery upload амжилтгүй");
    } finally {
      e.target.value = "";
      setUploadingGallery(false);
    }
  };

  const removeFromGallery = (idx) => {
    setCurrentAdvice((p) => {
      const next = [...(p.gallery || [])];
      next.splice(idx, 1);
      return { ...p, gallery: next };
    });
  };

  const getShareLinks = (id, title) => {
    const url = encodeURIComponent(`https://barrister.mn/advice/${id}`);
    const text = encodeURIComponent(title || "Зөвлөгөө");
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
    };
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Зөвлөгөө</h2>
        <Button
          onClick={() => {
            setCurrentAdvice({
              title: "",
              description: "",
              content: "",
              seoTitle: "",
              seoDescription: "",
              seoKeywords: "",
              cover: null,
              gallery: [],
            });
            setShowModal(true);
          }}
        >
          + Шинэ
        </Button>
      </div>

      {advices.map((a) => (
        <div key={a._id} className="border p-2 mb-4 rounded shadow bg-white dark:bg-gray-800">
          <div className="font-bold">{a.title}</div>
          {a.description && <div className="text-sm text-gray-800 dark:text-gray-300 mb-1">{a.description}</div>}
          <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-1">{a.seoDescription}</div>

          {/* cover preview (хэрэв API буцаадаг бол) */}
          {a.cover?.url ? (
            a.cover.resource_type === "video" ? (
              <video className="mt-2 rounded border bg-black" src={a.cover.url} controls width={320} />
            ) : (
              <img className="mt-2 rounded border bg-white" src={a.cover.url} alt="cover" width={320} />
            )
          ) : null}

          {/* gallery thumbs (хэрэв API буцаадаг бол) */}
          {Array.isArray(a.gallery) && a.gallery.length ? (
            <div className="flex gap-2 mt-2 flex-wrap">
              {a.gallery.map((m, i) =>
                m.resource_type === "video" ? (
                  <video key={i} src={m.url} controls width={120} className="rounded border bg-black" />
                ) : (
                  <img key={i} src={m.url} alt="" width={120} className="rounded border bg-white object-cover" />
                )
              )}
            </div>
          ) : null}

          <div className="flex gap-2 mt-3">
            <Button onClick={() => openEditModal(a._id)}>Засах</Button>
            <Button onClick={() => handleDelete(a._id)} variant="danger">
              Устгах
            </Button>
          </div>

          <div className="flex gap-3 mt-3 text-sm text-blue-600 dark:text-yellow-400">
            <a href={getShareLinks(a._id, a.title).facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={getShareLinks(a._id, a.title).twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href={getShareLinks(a._id, a.title).linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      ))}

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={currentAdvice._id ? "Зөвлөгөө засах" : "Шинэ зөвлөгөө"}>
          <div className="space-y-2">
            <Input name="title" label="Гарчиг" value={currentAdvice.title} onChange={handleInputChange} />
            <TextArea name="description" label="Тайлбар" value={currentAdvice.description} onChange={handleInputChange} rows={3} />
            <TextArea name="content" label="Агуулга" value={currentAdvice.content} onChange={handleInputChange} rows={6} />
            <Input name="seoTitle" label="SEO гарчиг" value={currentAdvice.seoTitle} onChange={handleInputChange} />
            <Input name="seoDescription" label="SEO тайлбар" value={currentAdvice.seoDescription} onChange={handleInputChange} />
            <Input name="seoKeywords" label="SEO түлхүүр үгс" value={currentAdvice.seoKeywords} onChange={handleInputChange} />

            {/* Cover upload + preview */}
            <div className="pt-2">
              <label className="block font-semibold mb-1">Cover зураг/видео</label>
              <input type="file" accept="image/*,video/*" onChange={onCoverSelect} />
              {uploadingCover && <div className="text-xs text-gray-500 mt-1">Cover байршуулж байна…</div>}
              {currentAdvice.cover?.url ? (
                <div className="mt-2 flex items-start gap-2">
                  {currentAdvice.cover.resource_type === "video" ? (
                    <video src={currentAdvice.cover.url} controls width={240} className="rounded border bg-black" />
                  ) : (
                    <img src={currentAdvice.cover.url} alt="cover" width={240} className="rounded border bg-white" />
                  )}
                  <div className="flex-1">
                    <Input
                      name="coverCaption"
                      label="Cover тайлбар"
                      value={currentAdvice.cover.caption || ""}
                      onChange={(e) =>
                        setCurrentAdvice((p) => ({ ...p, cover: { ...(p.cover || {}), caption: e.target.value } }))
                      }
                    />
                    <Button variant="danger" onClick={removeCover} className="mt-2">
                      Cover устгах
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Gallery upload + thumbs */}
            <div className="pt-2">
              <label className="block font-semibold mb-1">Галерей (олон зураг/видео)</label>
              <input type="file" multiple accept="image/*,video/*" onChange={onGallerySelect} />
              {uploadingGallery && <div className="text-xs text-gray-500 mt-1">Галерей байршуулж байна…</div>}
              {Array.isArray(currentAdvice.gallery) && currentAdvice.gallery.length ? (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {currentAdvice.gallery.map((m, i) => (
                    <div key={i} className="border rounded p-1 bg-gray-50">
                      {m.resource_type === "video" ? (
                        <video src={m.url} controls className="w-full rounded bg-black" />
                      ) : (
                        <img src={m.url} alt="" className="w-full h-28 object-cover rounded bg-white" />
                      )}
                      <Input
                        name={`gcap-${i}`}
                        label="Тайлбар"
                        value={m.caption || ""}
                        onChange={(e) =>
                          setCurrentAdvice((p) => {
                            const next = [...(p.gallery || [])];
                            next[i] = { ...next[i], caption: e.target.value };
                            return { ...p, gallery: next };
                          })
                        }
                      />
                      <Button variant="danger" onClick={() => removeFromGallery(i)} className="mt-1 w-full">
                        Устгах
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="text-right pt-2">
              <Button onClick={handleCreateOrUpdate}>
                {currentAdvice._id ? "Шинэчлэх" : "Хадгалах"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {confirmDeleteId && (
        <Modal onClose={() => setConfirmDeleteId(null)} title="Устгах баталгаажуулалт">
          <p className="mb-4">Та энэ зөвлөгөөг устгахдаа итгэлтэй байна уу?</p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setConfirmDeleteId(null)}>Болих</Button>
            <Button variant="danger" onClick={confirmDelete}>
              Устгах
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdviceAdmin;
