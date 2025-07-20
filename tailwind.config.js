// 📁 tailwind.config.js
const typography = require('@tailwindcss/typography');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",      // blue-600
        secondary: "#1e293b",    // slate-800
        light: "#f8fafc",        // slate-50
        muted: "#64748b",        // slate-500
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [typography],
};
