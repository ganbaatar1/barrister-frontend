// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

// 🚀 Firebase Admin-ийг ENV-ээс ачаалдаг цэвэр тохиргоо (файл бичихгүй)
let admin;
try {
  admin = require("./config/firebaseAdmin"); // алдаа гарвал доорх catch руу унаад процессыг зогсооно
} catch (e) {
  console.error("❌ Firebase Admin initialize хийхэд алдаа:", e.message);
  process.exit(1);
}

const app = express();

// --- proxy ард ажиллах үед IP, протоколыг зөв авах ---
app.set("trust proxy", 1);

// ✅ Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===== CORS тохиргоо (Vercel preview/prod бүх subdomain зөвшөөрнө) =====
const allowedExact = [
  process.env.CLIENT_URL,   // ж: https://barrister-frontend.vercel.app
  process.env.CLIENT_URL_2, // нэмэлт домайн (optional)
  "http://localhost:3000",
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl/Postman
  try {
    const u = new URL(origin);
    const host = u.hostname;
    if (allowedExact.includes(origin)) return true;
    if (host.endsWith(".vercel.app")) return true; // *.vercel.app
    if (host === "localhost") return true;
    return false;
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin, cb) =>
    isAllowedOrigin(origin)
      ? cb(null, true)
      : cb(new Error(`CORS policy: ${origin} origin-ыг зөвшөөрөхгүй байна.`), false),
  credentials: true,
};

app.use(cors(corsOptions));
// preflight
app.options("*", cors(corsOptions));

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend сервер амжилттай ажиллаж байна!");
});

// ===== Static: /uploads-г нээх (хэрэв түр хадгалалт хэрэглэж байвал үлдээгээрэй) =====
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// ===== API Routes =====
app.use("/api/lawyers", require("./routes/lawyerRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/advice", require("./routes/adviceRoutes"));
app.use("/api/contactSettings", require("./routes/contactSettings"));
app.use("/api/status", require("./routes/statusRoutes"));

// ✅ Media (Cloudinary) routes
app.use("/api/media", require("./routes/media"));

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Хуудас/ресурс олдсонгүй" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("🚨 Серверийн алдаа:", err.stack);
  res.status(500).json({
    error: "Серверийн дотоод алдаа",
    details: err.message || "Алдааны дэлгэрэнгүй мэдээлэл байхгүй",
  });
});

// ===== Start server =====
const PORT = process.env.PORT || 5050;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Сервер амжилттай ажиллаж байна — порт: ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("❌ DB-т холбогдох үед алдаа:", e.message);
    process.exit(1);
  });
