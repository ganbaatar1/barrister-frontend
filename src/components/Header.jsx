import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { Menu, X, Moon, Sun } from "lucide-react";
import logo from "../assets/logo.png";

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
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

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="h-8 sm:h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 text-sm sm:text-base">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`hover:underline ${
                isActive(to) ? "text-blue-600 dark:text-yellow-400 font-semibold" : "text-gray-800 dark:text-gray-100"
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
          <button onClick={toggleTheme} className="ml-2">
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
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 dark:text-gray-100">
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
                isActive(to) ? "text-blue-600 dark:text-yellow-400 font-semibold" : "text-gray-800 dark:text-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
          {user && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-gray-800 dark:text-gray-100">
              {t("nav.admin")}
            </Link>
          )}
          {!user ? (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-800 dark:text-gray-100">
              {t("nav.login")}
            </Link>
          ) : (
            <button onClick={handleLogout} className="block text-gray-800 dark:text-gray-100">
              {t("nav.logout")}
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
