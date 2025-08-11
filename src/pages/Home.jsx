import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHomeContent } from "../api/home";
import { Helmet } from "react-helmet-async";
import useDecodedTexts from "../utils/useDecodedText";
import Slider from "react-slick";
import { Target, Eye, ShieldCheck, Briefcase } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
const STATIC_URL = process.env.REACT_APP_STATIC_URL || "";
const IMAGE_BASE = API_BASE ? API_BASE.replace("/api", "") : STATIC_URL;

function Home() {
  const [rawContent, setRawContent] = useState({
    images: [],
    about: "",
    mission: "",
    vision: "",
    principles: "",
    services: "",
  });

  useEffect(() => {
    getHomeContent().then((res) => {
      if (res.data) setRawContent(res.data);
    });
  }, []);

  const content = useDecodedTexts(rawContent);

  const Section = ({ title, html, Icon }) => (
    <motion.section
      className="max-w-6xl mx-auto my-10 px-6 py-8 bg-gray-50 dark:bg-gray-800 shadow rounded-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4">
        {Icon ? (
          <div className="shrink-0 p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
            <Icon className="w-6 h-6 text-yellow-700 dark:text-yellow-300" />
          </div>
        ) : null}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-700 dark:text-yellow-400 mb-3">
            {title}
          </h2>
          <div
            className="prose dark:prose-invert max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </motion.section>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: true,
    adaptiveHeight: false,
  };

  const heroImages = Array.isArray(content.images) ? content.images : [];

  const iconMap = {
    "Бидний тухай": null,
    "Эрхэм зорилго": Target,
    "Алсын хараа": Eye,
    "Үндсэн зарчим": ShieldCheck,
    "Үйлчилгээний чиглэлүүд": Briefcase,
  };

  return (
    <>
      <Helmet>
        <title>Barrister.mn – Эхлэл</title>
        <meta
          name="description"
          content="Монголын хууль зүйн үйлчилгээний тэргүүлэгч Barrister.mn сайтын эхлэл хуудас."
        />
        <meta
          name="keywords"
          content="өмгөөлөгч, хуульч, хууль зүйн үйлчилгээ, barrister.mn"
        />
        <link rel="canonical" href="https://barrister.mn/" />
      </Helmet>

      {/* Hero Slider */}
      <div className="bg-gray-100 dark:bg-gray-900">
        {heroImages.length > 0 && (
          <div className="relative w-full overflow-hidden">
            <Slider {...sliderSettings}>
              {heroImages.map((img, idx) => {
                const src = (img.url || "").startsWith("http")
                  ? img.url
                  : `${IMAGE_BASE}${img.url || ""}`;
                return (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-[60vh] md:h-[80vh] lg:h-[90vh] object-cover"
                      loading="eager"
                    />
                    {img.caption ? (
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white px-4 py-3 md:px-6 md:py-4">
                        <p className="text-sm md:text-base lg:text-lg text-center line-clamp-2">
                          {img.caption}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </Slider>
          </div>
        )}
      </div>

      {/* Content Sections: responsive stack -> grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid gap-6 md:gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          <Section title="Бидний тухай" html={content.about} Icon={iconMap["Бидний тухай"]} />
          <Section title="Эрхэм зорилго" html={content.mission} Icon={iconMap["Эрхэм зорилго"]} />
          <Section title="Алсын хараа" html={content.vision} Icon={iconMap["Алсын хараа"]} />
          {content.principles ? (
            <Section title="Үндсэн зарчим" html={content.principles} Icon={iconMap["Үндсэн зарчим"]} />
          ) : null}
          {content.services ? (
            <Section title="Үйлчилгээний чиглэлүүд" html={content.services} Icon={iconMap["Үйлчилгээний чиглэлүүд"]} />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Home;
