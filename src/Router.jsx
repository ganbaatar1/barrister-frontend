// 📁 src/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// ✅ Аюулгүй lazy helper (default экспорт ашиглана)
function lazyPick(factory) {
  return lazy(async () => {
    const mod = await factory();
    const Comp = mod.default;
    if (!Comp) {
      throw new Error(`Lazy import failed: module is missing export "default"`);
    }
    return { default: Comp };
  });
}

// ⚙️ БҮГДИЙГ default экспорт гэж үзэж дуудаж байна
const Home          = lazyPick(() => import("./pages/Home"));
const News          = lazyPick(() => import("./pages/News"));
const NewsDetails   = lazyPick(() => import("./pages/NewsDetails"));
const Lawyers       = lazyPick(() => import("./pages/Lawyers"));
const Login         = lazyPick(() => import("./pages/Login"));
const Register      = lazyPick(() => import("./pages/Register"));
const Admin         = lazyPick(() => import("./pages/Admin"));
const Advice        = lazyPick(() => import("./pages/Advice"));
const AdviceDetails = lazyPick(() => import("./pages/AdviceDetails"));
const Testimonials  = lazyPick(() => import("./pages/Testimonials"));

export default function AppRouter() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center p-10">⏳ Хуудас ачаалж байна...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/lawyers" element={<Lawyers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/advice" element={<Advice />} />
            <Route path="/advice/:id" element={<AdviceDetails />} />
            <Route path="/testimonials" element={<Testimonials />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
