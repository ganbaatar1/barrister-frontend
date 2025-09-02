import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import useDecodedTexts from "../utils/useDecodedText";
import axiosInstance from "../api/axiosInstance";
import defaultImg from "../assets/default-profile.png";

// --- Туслахууд --------------------------------------------------------------
// STATIC_ORIGIN: prod/dev аль ч үед /uploads... замыг бүрэн URL болгох
const STATIC_ORIGIN =
  (process.env.REACT_APP_STATIC_URL || "").replace(/\/+$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

// Cloudinary эсэхийг таних
function isCloudinary(url = "") {
  return /res\.cloudinary\.com\/.+\/image\/upload\//i.test(url);
}

// Cloudinary-д thumbnail трансформаци оруулах (арилгалт/таслалт OK)
function cldThumb(url, w = 320, h = 400) {
  if (!isCloudinary(url)) return url;
  // аль хэдийн трансформ хийсэн бол дахин нэмэхгүй
  if (/\/image\/upload\/.*(w_|h_|c_)/i.test(url)) return url;
  return url.replace(
    /\/image\/upload\/(?!.*(w_|h_|c_))/i,
    `/image/upload/f_auto,q_auto,c_fill,w_${w},h_${h}/`
  );
}

// /uploads эсвэл харьцангуй замыг бүрэн URL болгох
function resolvePhotoUrl(v) {
  const raw = typeof v === "string" ? v : v?.url;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw; // Cloudinary эсвэл бүрэн URL
  if (raw.startsWith("/uploads")) return `${STATIC_ORIGIN}${raw}`;
  if (raw.startsWith("uploads")) return `${STATIC_ORIGIN}/${raw}`;
  return raw;
}
// ---------------------------------------------------------------------------

export default function Lawyers() {
  const [rawLawyers, setRawLawyers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/lawyers");
        setRawLawyers(res.data || []);
      } catch (err) {
        console.error("❌ Хуульчид татахад алдаа:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // HTML талбаруудыг decode (танай hook)
  const lawyers = useDecodedTexts(rawLawyers);

  return (
    <>
      <Helmet>
        <title>Хуульчид | Barrister.mn</title>
        <meta
          name="description"
          content="Монголын хуульчдын мэдээлэл, мэргэшил, хэлний чадвар болон ажлын туршлагыг үзнэ үү."
        />
        <meta
          name="keywords"
          content="хуульч, өмгөөлөгч, law, barrister.mn, хууль зүйн үйлчилгээ"
        />
        <link rel="canonical" href="https://barrister.mn/lawyers" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Хуульчид</h1>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">Ачаалж байна…</p>
        ) : !lawyers?.length ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Хуульчид олдсонгүй.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lawyers.map((l) => {
              const raw = resolvePhotoUrl(l.profilePhoto);
              // Cloudinary бол жижиг thumbnail трансформаци оруулна (c_fill,w,h)
              const photo = cldThumb(raw);
              const startedYear = l.startDate ? new Date(l.startDate).getFullYear() : null;

              return (
                <div
                  key={l._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow-md flex flex-col sm:flex-row items-center"
                >
                  <img
                    src={photo || defaultImg}
                    alt={`${l.firstName || ""} ${l.lastName || ""}`}
                    className="w-32 h-40 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6 bg-gray-50"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = defaultImg)}
                  />

                  <div className="flex-1 space-y-1 w-full">
                    <h2 className="text-xl font-semibold break-words">
                      {l.lastName || ""} {l.firstName || ""}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {l.academicDegree || "—"}
                    </p>

                    <p>
                      <strong>Мэргэшил:</strong>{" "}
                      {Array.isArray(l.specialization) && l.specialization.length
                        ? l.specialization.join(", ")
                        : "—"}
                    </p>

                    <p>
                      <strong>Хэлний чадвар:</strong>{" "}
                      {Array.isArray(l.languages) && l.languages.length
                        ? l.languages.join(", ")
                        : "—"}
                    </p>

                    <p>
                      <strong>Туршлага:</strong> {l.experience || "—"}
                    </p>

                    <p>
                      <strong>Статус:</strong> {l.status || "—"}
                      {startedYear ? (
                        <span className="text-gray-500"> • {startedYear} оноос</span>
                      ) : null}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
