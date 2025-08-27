// 📁 src/App.jsx
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { Suspense } from "react";
import AppRouter from "./Router";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import i18n from "./i18n";

export default function App() {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              {/* ⚠️ Lazy routes must be rendered inside Suspense */}
              <Suspense fallback={<div className="p-6">Ачаалж байна…</div>}>
                <AppRouter />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}
