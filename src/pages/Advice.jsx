import { useEffect, useState } from "react";
import api from "../api/advice";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
//const IMAGE_BASE = BASE_API.replace("/api", "");
function Advice() {
  const { t } = useTranslation();
  const [adviceList, setAdviceList] = useState([]);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await api.getAdvice();
        console.log("Зөвлөгөөний өгөгдөл:", response.data);
        setAdviceList(
          Array.isArray(response.data)
            ? response.data
            : response.data.advice || []
        );
      } catch (error) {
        console.error("Зөвлөгөө авахад алдаа гарлаа:", error);
      }
    };

    fetchAdvice();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>{t("advice.advice_page_title")}</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">{t("nav.advice")}</h1>

      {Array.isArray(adviceList) && adviceList.length > 0 ? (
        adviceList.map((advice) => (
          <div key={advice._id} className="bg-white shadow p-4 mb-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">{advice.title}</h2>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: advice.description }}
            ></div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">{t("advice.no_advice_found")}</p>
      )}
    </div>
  );
}

export default Advice;
