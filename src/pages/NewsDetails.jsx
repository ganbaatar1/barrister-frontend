import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
//const API_BASE =process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";
function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`/api/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("⚠️ Мэдээ татахад алдаа:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="p-6">⏳ Ачааллаж байна...</div>;

  if (!news) return <div className="p-6 text-red-600">❌ Мэдээ олдсонгүй.</div>;

  const siteUrl = `https://barrister.mn/news/${id}`;
  const shareImage = news.image ? `https://barrister.mn${news.image}` : undefined;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Helmet>
        <title>{news.seoTitle || news.title}</title>
        <meta name="description" content={news.seoDescription || news.content?.slice(0, 150)} />
        <meta name="keywords" content={news.seoKeywords || "хууль, мэдээ, barrister.mn"} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.seoDescription || news.content?.slice(0, 150)} />
        {shareImage && <meta property="og:image" content={shareImage} />}
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={siteUrl} />
      </Helmet>

      <h1 className="text-2xl font-bold">{news.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(news.date).toLocaleDateString("mn-MN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full max-h-[400px] object-cover rounded shadow"
        />
      )}

      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </div>
  );
}

export default NewsDetails;
