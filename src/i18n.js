// ✅ Зөв тохиргоотой i18n.js (сайжруулсан)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationMN from "./locales/mn/translation.json";
import translationEN from "./locales/en/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationZH from "./locales/zh/translation.json";
import translationKO from "./locales/ko/translation.json";
import translationKK from "./locales/kk/translation.json";

const resources = {
  mn: { translation: translationMN },
  en: { translation: translationEN },
  ru: { translation: translationRU },
  zh: { translation: translationZH },
  ko: { translation: translationKO },
  kk: { translation: translationKK },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "mn",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
