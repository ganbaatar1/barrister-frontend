import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

function LegalAdviceList() {
  const { t } = useTranslation();
  const [advices, setAdvices] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdvices();
  }, []);

  const fetchAdvices = async () => {
    try {
      const res = await axios.get("/api/advice");
      setAdvices(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Зөвлөгөө татахад алдаа:", err.message);
      setError(t("Failed to load legal advice"));
      setLoading(false);
    }
  };

  const filteredAdvices = advices.filter((advice) =>
    advice.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Helmet>
        <title>{t("Legal Advice")} - Barrister.mn</title>
        <meta
          name="description"
          content={t("Browse professional legal advice and recommendations from Mongolian lawyers.")}
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <h1 className="text-3xl font-bold text-yellow-800 mb-6">
        {t("Legal Advice")}
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder={t("Search by title...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
      </div>

      {loading && (
        <div className="text-center text-gray-500 py-8">
          {t("Loading...")}
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 py-8">
          {error}
        </div>
      )}

      {!loading && filteredAdvices.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          {t("No results found.")}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAdvices.slice(0, visibleCount).map((advice) => (
          <div key={advice._id} className="bg-white rounded shadow hover:shadow-lg transition p-4 flex flex-col">
            {advice.image && (
              <img
                src={advice.image}
                alt={advice.title || "Зураг"}
                loading="lazy"
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">{advice.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3">{advice.description}</p>
          </div>
        ))}
      </div>

      {!loading && filteredAdvices.length > visibleCount && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSeeMore}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {t("See more")}
          </button>
        </div>
      )}
    </div>
  );
}

export default LegalAdviceList;
