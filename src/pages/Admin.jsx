import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Admin components
import LawyersAdmin from "../components/admin/LawyersAdmin";
import AdviceAdmin from "../components/admin/AdviceAdmin";
import NewsAdmin from "../components/admin/NewsAdmin";
import TestimonialAdmin from "../components/admin/TestimonialAdmin";
import HomeAdmin from "../components/admin/HomeAdmin";
import ContactSettingsAdmin from "../components/admin/ContactSettingsAdmin";
import UsersAdmin from "../components/admin/UsersAdmin";

function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("lawyers");

  // 👮 Firebase authentication шалгалт
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const tabs = [
    { key: "lawyers", label: "Хуульчид" },
    { key: "advice", label: "Зөвлөгөө" },
    { key: "news", label: "Мэдээ" },
    { key: "testimonials", label: "Сэтгэгдэл" },
    { key: "home", label: "Нүүр хуудас" },
    { key: "contact", label: "Холбоо барих" },
    { key: "users", label: "Хэрэглэгчид" },
  ];

  const renderTab = () => {
    switch (tab) {
      case "lawyers": return <LawyersAdmin />;
      case "advice": return <AdviceAdmin />;
      case "news": return <NewsAdmin />;
      case "testimonials": return <TestimonialAdmin />;
      case "home": return <HomeAdmin />;
      case "contact": return <ContactSettingsAdmin />;
      case "users": return <UsersAdmin />;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">Админ самбар</h1>

      {/* 🔹 Tab navigation */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded font-semibold border ${
              tab === key
                ? "bg-yellow-500 text-white border-yellow-600"
                : "bg-gray-100 hover:bg-gray-200 border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 🔸 Active tab content */}
      <div className="bg-gray-50 p-4 rounded shadow">{renderTab()}</div>
    </div>
  );
}

export default Admin;
