import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import logo from "../assets/logo.png";
import axiosInstance from "../api/axiosInstance";

// ✅ Brand icon-ууд (react-icons)
import {
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaTelegram,
} from "react-icons/fa";

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // /contactSettings-оос social холбоосууд
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/contactSettings");
        const settings = res?.data || {};
        const fromServer = Array.isArray(settings.socialLinks) ? settings.socialLinks : [];

        const staticSocialLinks = [
          { name: "Facebook", url: "https://www.facebook.com/Barrister.mn/" },
          { name: "Messenger", url: "https://m.me/Barrister.mn" },
        ];

        const norm = (s = "") => s.trim().toLowerCase().replace(/\s+/g, " ");
        const staticNames = staticSocialLinks.map((s) => norm(s.name));
        const filtered = fromServer.filter((s) => !staticNames.includes(norm(s.name || "")));

        // 3-аас ихгүйгээр цэгцэлж харуулъя
        setSocialLinks([...staticSocialLinks, ...filtered].slice(0, 3));
      } catch {
        setSocialLinks([
          { name: "Facebook", url: "https://www.facebook.com/Barrister.mn/" },
          { name: "Messenger", url: "https://m.me/Barrister.mn" },
        ]);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/news", label: t("nav.news") },
    { to: "/lawyers", label: t("nav.lawyers") },
    { to: "/advice", label: t("nav.advice") },
    { to: "/testimonials", label: t("nav.testimonials") },
  ];

  const isActive = (path) => location.pathname === path;

  // 🔎 Нэр/URL-ээс брэнд тодорхойлох → зөв icon буцаана
  const pickBrandIcon = ({ name = "", url = "" }) => {
    const n = name.toLowerCase();
    const u = (url || "").toLowerCase();

    if (u.includes("m.me") || u.includes("messenger.com") || n.includes("messenger")) return FaFacebookMessenger;
    if (u.includes("facebook.com") || n === "fb" || n.includes("facebook")) return FaFacebook;
    if (u.includes("instagram.com") || n.includes("instagram") || n === "ig") return FaInstagram;
    if (u.includes("youtube.com") || u.includes("youtu.be") || n.includes("youtube")) return FaYoutube;
    if (u.includes("linkedin.com") || n.includes("linkedin")) return FaLinkedin;
    if (u.includes("twitter.com") || n.includes("twitter") || n === "x") return FaTwitter;
    if (u.includes("t.me") || u.includes("telegram.me") || n.includes("telegram")) return FaTelegram;

    // fallback (танигдаагүй бол ерөнхий Globe)
    return Globe;
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Barrister.mn" className="h-8 sm:h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3 text-sm sm:text-base">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`hover:underline ${
                isActive(to)
                  ? "text-blue-600 dark:text-yellow-400 font-semibold"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}

          {user && (
            <Link to="/admin" className="text-gray-800 dark:text-gray-100 hover:underline">
              {t("nav.admin")}
            </Link>
          )}

          {!user ? (
            <Link to="/login" className="text-gray-800 dark:text-gray-100 hover:underline">
              {t("nav.login")}
            </Link>
          ) : (
            <button onClick={handleLogout} className="text-gray-800 dark:text-gray-100 hover:underline">
              {t("nav.logout")}
            </button>
          )}

          {/* 🟦 Social icons (desktop) */}
          {socialLinks?.length > 0 && (
            <div className="flex items-center gap-1 pl-2 ml-2 border-l border-gray-200 dark:border-gray-800">
              {socialLinks.map((s, i) => {
                const Icon = pickBrandIcon(s);
                const isLucide = Icon === Globe; // fallback үед Lucide байна
                return (
                  <a
                    key={`${s.name}-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-100 opacity-80 hover:opacity-100"
                    title={s.name}
                  >
                    {isLucide ? <Icon size={18} /> : <Icon size={18} />} 
                  </a>
                );
              })}
            </div>
          )}

          <button onClick={toggleTheme} className="ml-1">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <LanguageSwitcher />
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-100">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <LanguageSwitcher />
          <button onClick={() => setMenuOpen((v) => !v)} className="text-gray-700 dark:text-gray-100">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 space-y-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block py-1 ${
                isActive(to)
                  ? "text-blue-600 dark:text-yellow-400 font-semibold"
                  : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}

          {user && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-800 dark:text-gray-100"
            >
              {t("nav.admin")}
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-800 dark:text-gray-100"
            >
              {t("nav.login")}
            </Link>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block text-gray-800 dark:text-gray-100"
            >
              {t("nav.logout")}
            </button>
          )}

          {/* 🟨 Social icons (mobile) */}
          {socialLinks?.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-3">
                {socialLinks.map((s, i) => {
                  const Icon = pickBrandIcon(s);
                  const isLucide = Icon === Globe;
                  return (
                    <a
                      key={`${s.name}-m-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
                      title={s.name}
                    >
                      {isLucide ? <Icon size={18} /> : <Icon size={18} />}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
