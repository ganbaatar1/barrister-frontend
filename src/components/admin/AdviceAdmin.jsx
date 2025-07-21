import React, { useState, useEffect } from "react";
import api from "../../api/advice";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import { toast } from "react-toastify";

function AdviceAdmin() {
  const [advices, setAdvices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentAdvice, setCurrentAdvice] = useState({
    title: "",
    description: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  useEffect(() => {
    loadAdvices();
  }, []);

  const loadAdvices = async () => {
    try {
      const res = await api.getAdvice();
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

      if (currentAdvice._id) {
        await api.updateAdvice(currentAdvice._id, currentAdvice);
        toast.success("Амжилттай шинэчлэгдлээ");
      } else {
        await api.createAdvice(currentAdvice);
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
      });
      loadAdvices();
    } catch (err) {
      console.error(err);
      toast.error("Хадгалах үед алдаа гарлаа");
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

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
      const data = await api.getAdviceById(id);
      if (!data) throw new Error("Мэдээлэл олдсонгүй");
      setCurrentAdvice(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Зөвлөгөө ачаалахад алдаа гарлаа");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAdvice({ ...currentAdvice, [name]: value || "" });
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
            });
            setShowModal(true);
          }}
        >
          + Шинэ
        </Button>
      </div>

      {advices.map((a) => (
        <div
          key={a._id}
          className="border p-2 mb-4 rounded shadow bg-white dark:bg-gray-800"
        >
          <div className="font-bold">{a.title}</div>
          {a.description && (
            <div className="text-sm text-gray-800 dark:text-gray-300 mb-1">
              {a.description}
            </div>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-1">
            {a.seoDescription}
          </div>
          <div className="flex gap-2 mt-2">
            <Button onClick={() => openEditModal(a._id)}>Засах</Button>
            <Button onClick={() => handleDelete(a._id)} variant="danger">
              Устгах
            </Button>
          </div>
          <div className="flex gap-3 mt-3 text-sm text-blue-600 dark:text-yellow-400">
            <a
              href={getShareLinks(a._id, a.title).facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href={getShareLinks(a._id, a.title).twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href={getShareLinks(a._id, a.title).linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      ))}

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          title={currentAdvice._id ? "Зөвлөгөө засах" : "Шинэ зөвлөгөө"}
        >
          <div className="space-y-2">
            <Input
              name="title"
              label="Гарчиг"
              value={currentAdvice.title}
              onChange={handleInputChange}
            />
            <TextArea
              name="description"
              label="Тайлбар"
              value={currentAdvice.description}
              onChange={handleInputChange}
              rows={3}
            />
            <TextArea
              name="content"
              label="Агуулга"
              value={currentAdvice.content}
              onChange={handleInputChange}
              rows={6}
            />
            <Input
              name="seoTitle"
              label="SEO гарчиг"
              value={currentAdvice.seoTitle}
              onChange={handleInputChange}
            />
            <Input
              name="seoDescription"
              label="SEO тайлбар"
              value={currentAdvice.seoDescription}
              onChange={handleInputChange}
            />
            <Input
              name="seoKeywords"
              label="SEO түлхүүр үгс"
              value={currentAdvice.seoKeywords}
              onChange={handleInputChange}
            />
            <div className="text-right pt-2">
              <Button onClick={handleCreateOrUpdate}>
                {currentAdvice._id ? "Шинэчлэх" : "Хадгалах"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {confirmDeleteId && (
        <Modal
          onClose={() => setConfirmDeleteId(null)}
          title="Устгах баталгаажуулалт"
        >
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
