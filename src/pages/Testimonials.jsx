import { useEffect, useState } from "react";
import { getTestimonials } from "../api/testimonial";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import useDecodedTexts from "../utils/useDecodedText";
import resolveImageUrl from "../utils/resolveImageUrl";

// Cloudinary туслахууд (avatar thumbnail 96x96)
function isCloudinary(url = "") {
  return /res\.cloudinary\.com\/.+\/image\/upload\//i.test(url);
}
function cldAvatar(url, w = 96, h = 96) {
  if (!isCloudinary(url)) return url;
  // аль хэдийн трансформ орсон бол дахин нэмэхгүй
  if (/\/image\/upload\/.*(w_|h_|c_|g_|q_|f_)/i.test(url)) return url;
  return url.replace(
    /\/image\/upload\/(?!.*(w_|h_|c_|g_|q_|f_))/i,
    `/image/upload/f_auto,q_auto,c_fill,g_face,w_${w},h_${h}/`
  );
}

// аль талбарт зураг байгааг уян хатан сонгоно: image → image.url → photo → photo.url
function pickImageField(item) {
  if (!item) return "";
  if (typeof item.image === "string") return item.image;
  if (item.image?.url) return item.image.url;
  if (typeof item.photo === "string") return item.photo;
  if (item.photo?.url) return item.photo.url;
  return "";
}

export default function Testimonials() {
  const { t } = useTranslation();
  const [rawTestimonials, setRawTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getTestimonials();
        setRawTestimonials(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("❌ Testimonials API error:", err);
        setError(t("testimonials.error") || "Алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  // Админаас ирэх HTML талбаруудыг decode (хэрвээ байвал)
  const testimonials = useDecodedTexts(rawTestimonials);

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
        <h1 className="text-3xl font-bold text-yellow-800 dark:text-yellow-400 mb-6">
          {t("nav.testimonials")}
        </h1>

        {loading && <p>{t("loading") || "Ачаалж байна…"}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            {testimonials.length === 0 ? (
              <p>{t("testimonials.empty") || "Сэтгэгдэл олдсонгүй"}</p>
            ) : (
              testimonials.map((item) => {
                const raw = pickImageField(item);
                const resolved = resolveImageUrl(raw); // /uploads → бүрэн URL, http(s) бол шууд
                const avatar = cldAvatar(resolved); // Cloudinary бол 96x96 face crop
                const initials =
                  (item.name?.trim()?.charAt(0)?.toUpperCase()) || "?";

                return (
                  <div
                    key={item._id}
                    className="border p-4 rounded shadow bg-white dark:bg-gray-800 dark:text-white flex gap-4 items-start"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={`${item.name || "Үйлчлүүлэгч"} зураг`}
                        className="w-16 h-16 rounded-full object-cover bg-gray-100"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement?.insertAdjacentHTML(
                            "afterbegin",
                            `<div class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">${initials}</div>`
                          );
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl">
                        {initials}
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-bold text-lg break-words">
                        {item.name || "Нэргүй"}
                      </h3>
                      {item.occupation && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.occupation}
                        </p>
                      )}
                      <p className="mt-2 leading-relaxed">
                        {item.message || ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}
