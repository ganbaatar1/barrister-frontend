import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHomeContent } from "../api/home";
import { Helmet } from "react-helmet-async";
import useDecodedTexts from "../utils/useDecodedText"; // ✅ Нэмсэн

const BASE_API = process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api";
const IMAGE_BASE = BASE_API.replace("/api", "");

function Home() {
  const [rawContent, setRawContent] = useState({
    image: "",
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

  // ✅ content-г decode хийж авна
  const content = useDecodedTexts(rawContent);

  const Section = ({ title, html }) => (
    <motion.section
      className="max-w-5xl mx-auto my-10 px-6 py-8 bg-gray-50 dark:bg-gray-800 shadow rounded-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 mb-4">
        {title}
      </h2>
      <div
        className="prose dark:prose-invert max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.section>
  );

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

      <div className="bg-gray-100 dark:bg-gray-900">
        {content.image && (
          <div className="max-w-7xl mx-auto">
            <img
              src={`${IMAGE_BASE}${content.image}`}
              alt="Home banner"
              className="w-full max-h-[500px] object-cover rounded-b-xl shadow"
            />
          </div>
        )}

        <Section title="Бидний тухай" html={content.about} />
        <Section title="Эрхэм зорилго" html={content.mission} />
        <Section title="Алсын хараа" html={content.vision} />
        {content.principles && (
          <Section title="Үндсэн зарчим" html={content.principles} />
        )}
        {content.services && (
          <Section title="Үйлчилгээний чиглэлүүд" html={content.services} />
        )}
      </div>
    </>
  );
}

export default Home;
