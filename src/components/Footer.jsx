import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useTranslation } from "react-i18next";

// ✅ Brand icon-ууд
import {
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaTelegram,
  FaGlobe,
} from "react-icons/fa";

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
        <div className="max-w-6xl mx-auto px-4">⏳ {t("loading")}...</div>
      </footer>
    );
  }

  const { phone, email, mapUrl } = settings;
  const incomingLinks = Array.isArray(settings.socialLinks) ? settings.socialLinks : [];

  // Урьдчилан тогтмол social — давхардлыг шүүнэ
  const staticSocialLinks = [
    { name: "Facebook", url: "https://www.facebook.com/Barrister.mn/" },
    { name: "Messenger", url: "https://m.me/Barrister.mn" },
  ];
  const norm = (s = "") => s.trim().toLowerCase().replace(/\s+/g, " ");
  const merged = [
    ...staticSocialLinks,
    ...incomingLinks.filter((l) => !staticSocialLinks.map((s) => norm(s.name)).includes(norm(l?.name || ""))),
  ];

  // 🔎 Нэр/URL-ээс брэнд тодорхойлж icon буцаана
  const pickIcon = ({ name = "", url = "" }) => {
    const n = name.toLowerCase();
    const u = (url || "").toLowerCase();

    if (u.includes("m.me") || u.includes("messenger.com") || n.includes("messenger")) return FaFacebookMessenger;
    if (u.includes("facebook.com") || n.includes("facebook") || n === "fb") return FaFacebook;
    if (u.includes("instagram.com") || n.includes("instagram") || n === "ig") return FaInstagram;
    if (u.includes("youtube.com") || u.includes("youtu.be") || n.includes("youtube")) return FaYoutube;
    if (u.includes("linkedin.com") || n.includes("linkedin")) return FaLinkedin;
    if (u.includes("twitter.com") || n.includes("twitter") || n === "x") return FaTwitter;
    if (u.includes("t.me") || u.includes("telegram.me") || n.includes("telegram")) return FaTelegram;

    return FaGlobe; // fallback
  };

  // map embed эсэх
  const isEmbed = typeof mapUrl === "string" && mapUrl.includes("maps/embed");

  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ✅ Дээд мөр: 3 багана зэрэгцээ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* 1) Холбоо барих */}
          <div>
            <h4 className="font-semibold mb-3">
              {t("admin.contact_settings.contact") !== "admin.contact_settings.contact"
                ? t("admin.contact_settings.contact")
                : "Холбоо барих"}
            </h4>

            {phone && (
              <p className="flex items-center gap-2">
                <Phone size={16} />
                <a href={`tel:${phone}`} className="hover:underline">
                  {phone}
                </a>
              </p>
            )}

            {email && (
              <p className="flex items-center gap-2 mt-1">
                <Mail size={16} />
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </p>
            )}
          </div>

          {/* 2) Сошиал холбоосууд */}
          <div>
            <h4 className="font-semibold mb-3">
              {t("admin.contact_settings.social_links") !== "admin.contact_settings.social_links"
                ? t("admin.contact_settings.social_links")
                : "Сошиал холбоосууд"}
            </h4>

            <ul className="space-y-1">
              {merged.map((link, idx) => {
                if (!link?.url) return null;
                const Icon = pickIcon(link);
                return (
                  <li key={`${link.name || "social"}-${idx}`} className="flex items-center gap-2">
                    <Icon size={16} />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="hover:underline"
                    >
                      {link.name || link.url}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3) Газрын зураг */}
          <div>
            <h4 className="flex items-center gap-2 mb-3 font-semibold">
              <MapPin size={16} />
              {t("admin.contact_settings.map_url") !== "admin.contact_settings.map_url"
                ? t("admin.contact_settings.map_url")
                : "Газрын зураг"}
            </h4>

            {isEmbed ? (
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
              />
            ) : mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline"
              >
                Google Maps-ээр харах
              </a>
            ) : (
              <p className="text-gray-400">Газрын зураг тохируулаагүй байна.</p>
            )}
          </div>
        </div>

        {/* доод мөр: copyright */}
        <hr className="border-gray-800 my-6" />
        <div className="text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Barrister.mn</p>
          <p>Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
