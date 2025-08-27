import { useTranslation } from "react-i18next";
import { useState } from "react";

const languages = [
  { code: "mn", label: "🇲🇳 Монгол" },
  { code: "en", label: "🇺🇸 English" },
  { code: "ru", label: "🇷🇺 Русский" },
  { code: "zh", label: "🇨🇳 中文" },
  { code: "ko", label: "🇰🇷 한국어" },
  { code: "kk", label: "🇰🇿 Қазақша" },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 bg-white dark:bg-gray-700 border rounded shadow hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
      >
        {current.label}
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                i18n.language === lang.code ? "font-semibold text-yellow-700 dark:text-yellow-400" : ""
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
