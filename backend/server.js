// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const app = express();

// ----- Trust proxy (heroku/vercel/nginx ард ажиллах үед) -----
app.set("trust proxy", 1);

// ===== Firebase Admin SDK setup (file commit хийхгүйгээр) =====
const admin = require("firebase-admin");

const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!base64ServiceAccount) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable байхгүй байна!");
  process.exit(1);
}

let serviceAccount;
try {
  const decoded = Buffer.from(base64ServiceAccount, "base64").toString("utf8");
  serviceAccount = JSON.parse(decoded);
} catch (e) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_BASE64 задлах/JSON parse хийхэд алдаа:", e.message);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // storageBucket гэх мэт нэмэлт тохиргоо байвал эндээ оруулна
  });
  console.log("✅ Firebase Admin амжилттай initialize боллоо.");
}
// ===============================

// ✅ Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,           // /uploads-ыг кросс-орижинд үзүүлэхэд
    crossOriginEmbedderPolicy: false,           // зарим asset-тай зөрчилдөхөөс сэргийлэх
    contentSecurityPolicy: false,               // SPA + WYSIWYG гэх мэтэд хэрэгтэй байж болно
  })
);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend сервер амжилттай ажиллаж байна!");
});

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global CORS тохиргоо
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  "http://localhost:3000",
  "https://barrister-frontend.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // curl, Postman зэрэг
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: ${origin} origin-ыг зөвшөөрөхгүй байна.`), false);
    },
    credentials: true,
  })
);

// uploads хавтас болон default зураг үүсгэх
const ensureDefaultProfileImage = () => {
  const uploadsDir = path.join(__dirname, "uploads");
  const defaultImageSrc = path.join(__dirname, "../src/assets/default-profile.png");
  const defaultImageDest = path.join(uploadsDir, "default-profile.png");

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (fs.existsSync(defaultImageSrc) && !fs.existsSync(defaultImageDest)) {
      fs.copyFileSync(defaultImageSrc, defaultImageDest);
      console.log("✅ default-profile.png зургийг хууллаа.");
    }
  } catch (err) {
    console.error("❌ default зургийг бэлтгэхэд алдаа:", err.message);
  }
};

// ✅ Static файл – /uploads-г нийтэд нээх
ensureDefaultProfileImage();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/lawyers", require("./routes/lawyerRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/advice", require("./routes/adviceRoutes"));
app.use("/api/contactSettings", require("./routes/contactSettings"));

// 404 (олдсонгүй) handler
app.use((req, res, next) => {
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

// Start server
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
