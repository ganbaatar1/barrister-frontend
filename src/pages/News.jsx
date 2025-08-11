// 📁 src/pages/News.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useDecodedTexts from "../utils/useDecodedText";
import resolveImageUrl from "../utils/resolveImageUrl";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";

function News() {
  const { t } = useTranslation();
  const [rawNews, setRawNews] = useState([]);
  const newsList = useDecodedTexts(rawNews);

  useEffect(() => {
    axios
      .get(`${API_BASE}/news`)
      .then((res) => {
        setRawNews(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("❌ News API:", err));
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
                      src={resolveImageUrl(item.image)}
                      alt={item.title || "Мэдээ"}
                      className="w-full h-48 object-cover rounded mb-3"
                      loading="lazy"
                    />
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

export default News;
