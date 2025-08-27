import { useEffect, useState } from "react";
import { getTestimonials } from "../api/testimonial";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import useDecodedTexts from "../utils/useDecodedText";

function Testimonials() {
  const { t } = useTranslation();
  const [rawTestimonials, setRawTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTestimonials()
      .then((res) => {
        console.log("✅ Testimonials API response:", res.data);
        // API шууд массив буцааж байвал:
        setRawTestimonials(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Testimonials API error:", err);
        setError(t("testimonials.error") || "Алдаа гарлаа");
        setLoading(false);
      });
  }, [t]);

  const testimonials = useDecodedTexts(rawTestimonials);
//const testimonials = rawTestimonials; // түр хасав


  return (
    <>
      <Helmet>
        <title>{t("nav.testimonials")} | Barrister.mn</title>
        <meta
          name="description"
          content="Barrister.mn сайт дээрх үйлчлүүлэгчдийн сэтгэгдэл, үнэлгээ, туршлага."
        />
        <meta
          name="keywords"
          content="сэтгэгдэл, үнэлгээ, үйлчлүүлэгч, хуульч, barrister.mn"
        />
        <link rel="canonical" href="https://barrister.mn/testimonials" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-yellow-800 mb-6">
          {t("nav.testimonials")}
        </h1>

        {loading && <p>{t("loading") || "Уншиж байна..."}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            {testimonials.length === 0 ? (
              <p>{t("testimonials.empty") || "Сэтгэгдэл олдсонгүй"}</p>
            ) : (
              testimonials.map((item) => (
                <div
                  key={item._id}
                  className="border p-4 rounded shadow bg-white dark:bg-gray-800 dark:text-white flex space-x-4"
                >
                  {item.photo ? (
                    <img
                      src={
                        item.photo.startsWith("http")
                          ? item.photo
                          : `${process.env.REACT_APP_API_BASE_URL || "https://barrister-backend.onrender.com/api"}${item.photo}`
                      }
                      alt={`${item.name || "Үйлчлүүлэгч"} зураг`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                      {(item.name?.charAt(0).toUpperCase()) || "?"}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-lg">{item.name || "Нэргүй"}</h3>
                    {item.occupation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.occupation}</p>
                    )}
                    <p className="mt-2">{item.message || ""}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Testimonials;
