import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDecodedTexts from "../utils/useDecodedText";

const fallbackImage = "/default-image.jpg";

function News() {
  const { t } = useTranslation();
  const [rawNewsList, setRawNewsList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/news")
      .then((res) => setRawNewsList(res.data || []))
      .catch((err) => console.error("⚠️ Мэдээ татах үед алдаа:", err));
  }, []);

  const newsList = useDecodedTexts(rawNewsList);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getExcerpt = (html = "", maxLength = 140) => {
    const text = html.replace(/<[^>]*>?/gm, "");
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

  const handleShareFacebook = (newsId, title) => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `https://barrister.mn/news/${newsId}`
    )}&quote=${encodeURIComponent(title || "")}`;
    window.open(shareUrl, "_blank");
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

        {newsList.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">{t("news.no_news")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item) => {
              const excerpt = getExcerpt(item.content);
              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition-all flex flex-col"
                >
                  <Link to={`/news/${item._id}`}>
                    <img
                      src={item.image || fallbackImage}
                      alt={item.title || "Мэдээ"}
                      className="w-full h-40 object-cover mb-3 rounded"
                    />
                    <h3 className="text-lg font-semibold mb-1">
                      {item.title || "Гарчиг байхгүй"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.date ? formatDate(item.date) : "Огноо байхгүй"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {excerpt}
                    </p>
                  </Link>

                  {/* ✅ Facebook хуваалцах товч */}
                  <button
                    onClick={() => handleShareFacebook(item._id, item.title)}
                    className="mt-auto inline-block text-sm text-blue-600 hover:underline"
                  >
                    Facebook-д хуваалцах
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default News;
