// 📁 src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import { getHomeContent } from "../api/home";
import resolveImageUrl from "../utils/resolveImageUrl";
import useDecodedText from "../utils/useDecodedText";
//import useDecodedTexts from "../utils/useDecodedText";
import { Target, Eye, Scale, Briefcase } from "lucide-react";

// ⚙️ Autoplay-ийн хурдыг эндээс тохируулна (мс)
// .env дотор REACT_APP_SLIDER_AUTOPLAY_MS=6000 гэж бас тавьж болно
const AUTOPLAY_MS = Number(process.env.REACT_APP_SLIDER_AUTOPLAY_MS || 6000);

const baseSliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: AUTOPLAY_MS, // ← хурд
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  pauseOnHover: true,
  adaptiveHeight: false,
};

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
    return () => { alive = false; };
  }, []);

  // images массив → fallback нь ганц image талбар
  const slides = useMemo(() => {
    const imgs = Array.isArray(data?.images) ? data.images : [];
    if (imgs.length > 0) return imgs;
    if (data?.image) return [{ url: data.image, caption: "" }];
    return [];
  }, [data]);

  // Агуулгын HTML-ийг decode хийнэ
  const decoded = useDecodedText({
    about: data?.about || "",
    mission: data?.mission || "",
    vision: data?.vision || "",
    principles: data?.principles || "",
    services: data?.services || "",
  });

  // Slider settings (хэрвээ slides байхгүй бол autoplay унтраана)
  const sliderSettings = useMemo(
    () =>
      slides.length > 0
        ? baseSliderSettings
        : { ...baseSliderSettings, autoplay: false },
    [slides.length]
  );

  return (
    <div className="space-y-10">
      {/* Hero / Slider — 💡 fullscreen өндөртэй */}
      <section className="relative">
        {slides.length > 0 ? (
          <Slider {...sliderSettings}>
            {slides.map((s, i) => {
              const src = resolveImageUrl(s.url);
              const caption = (s.caption || "").trim();
              return (
                <div key={i} className="relative">
                  {/* Fullscreen өндөр (том дэлгэц дээр) */}
                  <img
                    src={src}
                    alt={caption || `banner-${i + 1}`}
                    className="w-full h-[70vh] md:h-[85vh] lg:h-screen object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  {/* 🟣 Давхар текст ба градиент бүрхүүл */}
                  <div className="absolute inset-0">
                    {/* Дээрээс доош бараан градиент */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    {/* Доод-зүүн талд текст блок */}
                    {(caption) && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 max-w-3xl text-white px-4">
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold drop-shadow-md">
                          {caption}
                        </h2>
                        {/* Хэрэв тайлбар урт бол дээд талд зай */}
                        <p className="mt-3 text-sm md:text-base lg:text-lg opacity-90">
                          {/* Хүсвэл энд нэмэлт богино танилцуулга эсвэл CTA байрлуулж болно */}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </Slider>
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

      {/* Mission / Vision / Principles / Services — дэлгэцнээс хамааран grid/stack */}
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
