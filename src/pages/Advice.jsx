import { useEffect, useState } from "react";
import api from "../api/advice";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// /uploads (dev) болон бүрэн URL (Cloudinary)-ыг хоёуланг зөв харуулах
function resolveMediaUrl(u) {
  if (!u) return "";
  const raw = typeof u === "string" ? u : u.url;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;               // Cloudinary эсвэл бусад бүрэн URL
  if (raw.startsWith("/uploads")) return `http://localhost:5050${raw}`; // backend static (dev)
  if (raw.startsWith("uploads")) return `http://localhost:5050/${raw}`;
  return raw;
}
function isVideoByUrl(url = "") {
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);
}
function MediaThumb({ item, className = "" }) {
  const url = resolveMediaUrl(item);
  if (!url) return null;
  const type = typeof item === "object" ? item.resource_type : undefined;
  const isVideo = type === "video" || isVideoByUrl(url);
  return isVideo ? (
    <video src={url} controls className={className || "w-full rounded bg-black"} />
  ) : (
    <img src={url} alt="" className={className || "w-full rounded object-cover bg-white"} />
  );
}

export default function Advice() {
  const { t } = useTranslation();
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.getAdvice();
        const d = res?.data;
        const list = Array.isArray(d) ? d : Array.isArray(d?.advice) ? d.advice : [];
        setAdviceList(list);
      } catch (error) {
        console.error("Зөвлөгөө авахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>{t("advice.advice_page_title")}</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">{t("nav.advice")}</h1>

      {loading ? (
        <p className="text-gray-500">{t("common.loading") || "Ачаалж байна…"}</p>
      ) : Array.isArray(adviceList) && adviceList.length > 0 ? (
        adviceList.map((advice) => {
          // cover нь шинэ схем; image нь хуучин өгөгдлийн fallback
          const cover = advice.cover?.url || advice.image || "";
          const gallery = Array.isArray(advice.gallery) ? advice.gallery : [];
          const bodyHtml = advice.content || advice.description || "";

          return (
            <article key={advice._id} className="bg-white shadow p-4 mb-6 rounded-xl space-y-4">
              {/* Cover */}
              {cover ? (
                <MediaThumb item={cover} className="w-full max-h-80 object-cover rounded border" />
              ) : null}

              {/* Title */}
              <h2 className="text-xl font-semibold">{advice.title}</h2>

              {/* Body (HTML from admin) */}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }}></div>

              {/* Gallery (if any) */}
              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((m, i) => (
                    <MediaThumb
                      key={i}
                      item={m}
                      className="w-full h-36 rounded object-cover border bg-gray-50"
                    />
                  ))}
                </div>
              ) : null}
            </article>
          );
        })
      ) : (
        <p className="text-gray-500">{t("advice.no_advice_found")}</p>
      )}
    </div>
  );
}
