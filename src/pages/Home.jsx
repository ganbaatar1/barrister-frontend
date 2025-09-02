// 📁 src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { getHomeContent } from "../api/home";
import resolveImageUrl from "../utils/resolveImageUrl";
import useDecodedText from "../utils/useDecodedText";
import { Target, Eye, Scale, Briefcase } from "lucide-react";

// ⚙️ Autoplay хурд (мс)
const AUTOPLAY_MS = Number(process.env.REACT_APP_SLIDER_AUTOPLAY_MS || 6000);

// ✅ Суурь тохиргоо — multi-slide үед л dots/infinite/autoplay-г нэмж асаана
const baseSliderSettings = {
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  pauseOnHover: true,
  adaptiveHeight: false,
  lazyLoad: "ondemand",
};

// --- Cloudinary туслахууд ---------------------------------------------------
function isCloudinary(url = "") {
  return /res\.cloudinary\.com\/.+\/image\/upload\//i.test(url);
}
// ж: .../upload/ → .../upload/f_auto,q_auto,c_fill,w_1280/
function cldTransform(url, w) {
  if (!isCloudinary(url)) return url;
  return url.replace(
    /\/image\/upload\/(?!q_.*|f_.*|c_.*|w_.*)/i,
    `/image/upload/f_auto,q_auto,c_fill,w_${w}/`
  );
}
function buildSrcSet(url, widths = [480, 768, 1024, 1280, 1600, 1920]) {
  if (!isCloudinary(url)) return "";
  return widths.map((w) => `${cldTransform(url, w)} ${w}w`).join(", ");
}
// ---------------------------------------------------------------------------

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getHomeContent();
        if (!alive) return;
        setData(res?.data || null);
      } catch (e) {
        console.error("Нүүр агуулга татахад алдаа:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // images массив → fallback нь ганц image талбар
  const slides = useMemo(() => {
    const imgs = Array.isArray(data?.images) ? data.images : [];
    if (imgs.length > 0) return imgs;
    if (data?.image) return [{ url: data.image, caption: "" }];
    return [];
  }, [data]);

  // Агуулгын HTML-ийг decode
  const decoded = useDecodedText({
    about: data?.about || "",
    mission: data?.mission || "",
    vision: data?.vision || "",
    principles: data?.principles || "",
    services: data?.services || "",
  });

  // ✅ Зургуудын тоонд уялдсан slider settings
  const sliderSettings = useMemo(() => {
    const multi = slides.length > 1;
    return {
      ...baseSliderSettings,
      dots: multi,
      infinite: multi,
      autoplay: multi,
      autoplaySpeed: AUTOPLAY_MS,
    };
  }, [slides.length]);

  return (
    <div className="space-y-10">
      {/* Hero / Slider */}
      <section className="relative">
        {slides.length > 1 ? (
          // ≥2 зураг: Slider ашиглана
          <Slider key="multi" {...sliderSettings}>
            {slides.map((s, i) => {
              const raw = s?.url || "";
              const srcResolved = resolveImageUrl(raw);
              const caption = (s?.caption || "").trim();
              const isCld = isCloudinary(srcResolved);
              const src = isCld ? cldTransform(srcResolved, 1600) : srcResolved;
              const srcSet = isCld ? buildSrcSet(srcResolved) : undefined;
              const sizes = isCld ? "(max-width: 768px) 100vw, 100vw" : undefined;

              return (
                <div key={`${raw}-${i}`} className="relative">
                  <img
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={caption || `banner-${i + 1}`}
                    className="w-full h-[70vh] md:h-[85vh] lg:h-screen object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement?.insertAdjacentHTML(
                        "afterbegin",
                        '<div class="w-full h-[70vh] md:h-[85vh] lg:h-screen bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">Зураг ачаалдсангүй</div>'
                      );
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    {caption && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 max-w-3xl text-white px-4">
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold drop-shadow-md">
                          {caption}
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : slides.length === 1 ? (
          // ✅ 1 зураг: Slider МАШИХГҮЙ — клон үүсэхгүй
          (() => {
            const s = slides[0];
            const raw = s?.url || "";
            const srcResolved = resolveImageUrl(raw);
            const caption = (s?.caption || "").trim();
            const isCld = isCloudinary(srcResolved);
            const src = isCld ? cldTransform(srcResolved, 1600) : srcResolved;
            const srcSet = isCld ? buildSrcSet(srcResolved) : undefined;
            const sizes = isCld ? "(max-width: 768px) 100vw, 100vw" : undefined;

            return (
              <div className="relative">
                <img
                  src={src}
                  srcSet={srcSet}
                  sizes={sizes}
                  alt={caption || "banner-1"}
                  className="w-full h-[70vh] md:h-[85vh] lg:h-screen object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.insertAdjacentHTML(
                      "afterbegin",
                      '<div class="w-full h-[70vh] md:h-[85vh] lg:h-screen bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">Зураг ачаалдсангүй</div>'
                    );
                  }}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  {caption && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 max-w-3xl text-white px-4">
                      <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold drop-shadow-md">
                        {caption}
                      </h2>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          // Fallback hero
          <div className="w-full h-[60vh] md:h-[80vh] lg:h-screen bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-xl md:text-2xl font-semibold">Зураг одоогоор алга</div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Админ талаас зураг нэмснээр энд автоматаар харагдана.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Бидний тухай</h2>
        {loading ? (
          <SkeletonLines />
        ) : (
          <div
            className="prose max-w-none dark:prose-invert prose-p:leading-7"
            dangerouslySetInnerHTML={{ __html: decoded.about || "" }}
          />
        )}
      </section>

      {/* Mission / Vision / Principles / Services */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card title="Эрхэм зорилго" icon={<Target className="w-6 h-6" />} html={decoded.mission} loading={loading} />
          <Card title="Алсын хараа" icon={<Eye className="w-6 h-6" />} html={decoded.vision} loading={loading} />
          <Card title="Үндсэн зарчим" icon={<Scale className="w-6 h-6" />} html={decoded.principles} loading={loading} />
          <Card title="Үйлчилгээний чиглэлүүд" icon={<Briefcase className="w-6 h-6" />} html={decoded.services} loading={loading} />
        </div>
      </section>
    </div>
  );
}

function Card({ title, icon, html, loading }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {loading ? (
        <SkeletonLines small />
      ) : (
        <div
          className="prose prose-sm max-w-none dark:prose-invert prose-ul:mt-2 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: html || "" }}
        />
      )}
    </div>
  );
}

function SkeletonLines({ small = false }) {
  return (
    <div className="space-y-2 animate-pulse">
      <div className={`rounded ${small ? "h-3" : "h-4"} bg-gray-200 dark:bg-gray-700 w-11/12`} />
      <div className={`rounded ${small ? "h-3" : "h-4"} bg-gray-200 dark:bg-gray-700 w-10/12`} />
      <div className={`rounded ${small ? "h-3" : "h-4"} bg-gray-200 dark:bg-gray-700 w-8/12`} />
    </div>
  );
}
