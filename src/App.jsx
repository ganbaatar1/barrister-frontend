// 📁 src/App.jsx
import AppRouter from "./Router";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import i18n from "./i18n";

function App() {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}

export default App;
