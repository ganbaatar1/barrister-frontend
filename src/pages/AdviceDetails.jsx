import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";

function AdviceDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await axios.get(`${API_BASE}/advice/${id}`);
        setAdvice(res.data);
      } catch (err) {
        console.error("Зөвлөгөө татахад алдаа:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, [id]);

  const embedYouTube = (url) => {
    const match = url?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    if (!match) return null;
    return (
      <iframe
        src={`https://www.youtube.com/embed/${match[1]}`}
        title="Зөвлөгөө бичлэг"
        allowFullScreen
        className="w-full h-64 mt-4 rounded shadow"
      ></iframe>
    );
  };

  if (loading) return <div className="p-6">⏳ {t("loading")}</div>;
  if (!advice) return <div className="p-6 text-red-600">❌ {t("not_found")}</div>;

  const siteUrl = `https://barrister.mn/advice/${id}`;
  const shareImage = advice.image ? `https://barrister.mn${advice.image}` : "";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Helmet>
        <title>{advice.seoTitle || advice.title}</title>
        <meta
          name="description"
          content={advice.seoDescription || advice.description?.slice(0, 150)}
        />
        <meta property="og:title" content={advice.title} />
        <meta
          property="og:description"
          content={advice.seoDescription || advice.description?.slice(0, 150)}
        />
        {shareImage && <meta property="og:image" content={shareImage} />}
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={siteUrl} />
      </Helmet>

      <h1 className="text-2xl font-bold">{advice.title}</h1>

      {advice.videoUrl && embedYouTube(advice.videoUrl)}

      <div
        className="prose dark:prose-invert max-w-none mt-4"
        dangerouslySetInnerHTML={{ __html: advice.description }}
      />
    </div>
  );
}

export default AdviceDetails;
