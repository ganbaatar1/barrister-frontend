import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

const Home = lazy(() => import("./pages/Home"));
const News = lazy(() => import("./pages/News"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const Lawyers = lazy(() => import("./pages/Lawyers"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Advice = lazy(() => import("./pages/Advice"));
const AdviceDetails = lazy(() => import("./pages/AdviceDetails"));
const Testimonials = lazy(() => import("./pages/Testimonials"));

function AppRouter() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center p-10">⏳ Хуудас ачаалж байна...</div>}>
          <Routes>
            <Route index element={<Home />} />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default AppRouter;
