import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("/contactSettings");
        setSettings(res.data);
      } catch (err) {
        console.error("⚠️ Contact settings татахад алдаа:", err.message);
      }
    };
    fetchSettings();
  }, []);

  if (!settings) {
    return (
      <footer className="bg-gray-900 text-white py-6 text-center text-sm">
        <div className="max-w-6xl mx-auto px-4">
          ⏳ {t("loading")}...
        </div>
      </footer>
    );
  }

  const { phone, email, mapUrl, socialLinks = [] } = settings;

  const staticSocialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/Barrister.mn/" },
    { name: "Messenger", url: "https://m.me/Barrister.mn" },
  ];

  // Нэрийг стандарт болгох normalize функц
  const normalize = (name) =>
    name.trim().toLowerCase().replace(/\s+/g, " ");

  // Давхардсан нэртэй холбоосуудыг шүүх
  const staticNames = staticSocialLinks.map((s) => normalize(s.name));
  const filteredSocialLinks = socialLinks.filter(
    (link) => !staticNames.includes(normalize(link.name))
  );

  const allSocialLinks = [...staticSocialLinks, ...filteredSocialLinks];

  return (
    <footer className="bg-gray-900 text-gray-100 py-10 border-t border-gray-800">
      <div
        className="
          max-w-7xl mx-auto px-4
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm min-h-[200px]
        "
      >
        {/* 1-р багана: Холбоо барих */}
        <div>
          <h4 className="font-semibold mb-2">
            {t("admin.contact_settings.contact") !== "admin.contact_settings.contact"
              ? t("admin.contact_settings.contact")
              : "Холбоо барих"}
          </h4>
          {phone && (
            <p className="flex items-center gap-2">
              <Phone size={16} />
              <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
            </p>
          )}
          {email && (
            <p className="flex items-center gap-2 mt-1">
              <Mail size={16} />
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            </p>
          )}
          {mapUrl?.includes("maps/embed") && (
            <div className="mt-3">
              <h4 className="flex items-center gap-2 mb-2 font-medium">
                <MapPin size={16} />
                {t("admin.contact_settings.map_url") !== "admin.contact_settings.map_url"
                  ? t("admin.contact_settings.map_url")
                  : "Газрын зураг"}
              </h4>
              <iframe
                src={mapUrl}
                title="Газрын зураг"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-sm"
              ></iframe>
            </div>
          )}
        </div>

        {/* 2-р багана: Сошиал холбоосууд */}
        <div>
          <h4 className="font-semibold mb-2">
            {t("admin.contact_settings.social_links") !== "admin.contact_settings.social_links"
              ? t("admin.contact_settings.social_links")
              : "Сошиал холбоосууд"}
          </h4>
          <ul className="space-y-1">
            {allSocialLinks.map((link, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Globe size={16} />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 3-р багана: Мап (газрын зураг) */}
        {/* mapUrl iframe-тай 1-р баган дээр байгаа тул энд авахгүй. Хэрвээ тусдаа багана болгох шаардлагатай бол 1-р баганас салгаж болно. */}
        {/* Энэ жишээнд 1-р баганад багтсан хэвээр үлдлээ */}

        {/* 4-р багана: Эрх хуулиар хамгаалагдсан */}
        <div
          className="
            flex flex-col justify-end items-end text-right text-xs text-gray-400
            md:items-end md:text-right
            sm:items-center sm:text-center
            items-center text-center
            mt-6 md:mt-0
          "
        >
          <p>© {new Date().getFullYear()} Barrister.mn</p>
          <p>Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
