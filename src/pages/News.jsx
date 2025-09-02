// 📁 src/pages/News.jsx
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDecodedTexts from "../utils/useDecodedText";
import resolveImageUrl from "../utils/resolveImageUrl";
import axiosInstance from "../api/axiosInstance";

// --- Cloudinary туслахууд ---------------------------------------------------
function isCloudinary(url = "") {
  return /res\.cloudinary\.com\/.+\/image\/upload\//i.test(url);
}
// Картад тохирсон 3:2 харьцаатай thumbnail
function cldCard(url, w = 640) {
  if (!isCloudinary(url)) return url;
  // аль хэдийн трансформ орсон байвал дахин нэмэхгүй
  if (/\/image\/upload\/.*(ar_|w_|c_|q_|f_)/i.test(url)) return url;
  return url.replace(
    /\/image\/upload\/(?!.*(ar_|w_|c_|q_|f_))/i,
    `/image/upload/f_auto,q_auto,c_fill,ar_3:2,w_${w}/`
  );
}
function buildCardSrcSet(url, widths = [320, 480, 640, 768, 960]) {
  if (!isCloudinary(url)) return "";
  return widths
    .map(
      (w) =>
        url.replace(
          /\/image\/upload\/(?!.*(ar_|w_|c_|q_|f_))/i,
          `/image/upload/f_auto,q_auto,c_fill,ar_3:2,w_${w}/`
        ) + ` ${w}w`
    )
    .join(", ");
}
// ---------------------------------------------------------------------------

export default function News() {
  const { t } = useTranslation();
  const [rawNews, setRawNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const newsList = useDecodedTexts(rawNews);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/news");
        setRawNews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ News API:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getExcerpt = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > 160 ? text.slice(0, 160) + "…" : text;
  };

  return (
    <>
      <Helmet>
        <title>{t("news.title")} | Barrister.mn</title>
        <meta name="description" content={t("news.description")} />
        <meta name="keywords" content="хууль, эрх зүй, мэдээ, barrister" />
        <link rel="canonical" href="https://barrister.mn/news" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-yellow-800 dark:text-yellow-400">
          {t("news.title")}
        </h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Ачаалж байна…</p>
        ) : newsList.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">{t("news.no_news")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item) => {
              const raw = resolveImageUrl(item.image);
              const isCld = isCloudinary(raw);
              const src = isCld ? cldCard(raw, 640) : raw;
              const srcSet = isCld ? buildCardSrcSet(raw) : undefined;
              const sizes =
                "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
              const excerpt = getExcerpt(item.content);

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-all flex flex-col"
                >
                  <Link to={`/news/${item._id}`}>
                    {src ? (
                      <img
                        src={src}
                        srcSet={srcSet}
                        sizes={srcSet ? sizes : undefined}
                        alt={item.title || "Мэдээ"}
                        className="w-full h-48 object-cover rounded mb-3 bg-gray-50"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : null}
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                      {excerpt}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
