//const requireAuth = require("../middleware/auth");
const express = require("express");
const multer = require("multer");
const path = require("path");
const News = require("../models/News");
const router = express.Router();

// 📦 Upload config
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Зөвхөн зураг оруулна уу"));
    }
    cb(null, true);
  },
});

// ➕ POST: create news
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, content, date, seoTitle, seoDescription, seoKeywords } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Гарчиг болон агуулга заавал шаардлагатай" });
    }

    const news = new News({
      title,
      content,
      date: date || Date.now(),
      image: req.file ? `/uploads/${req.file.filename}` : "",
      seoTitle,
      seoDescription,
      seoKeywords,
    });

    const saved = await news.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("❌ POST /api/news алдаа:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

// 📥 GET all
router.get("/", async (_, res) => {
  try {
    const allNews = await News.find().sort({ date: -1 });
    return res.json(allNews);
  } catch (err) {
    console.error("❌ GET /api/news алдаа:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ✏️ PUT: update
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const update = {
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      seoTitle: req.body.seoTitle,
      seoDescription: req.body.seoDescription,
      seoKeywords: req.body.seoKeywords,
    };

    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    }

    const updated = await News.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.json(updated);
  } catch (err) {
    console.error(`❌ PUT /api/news/${req.params.id} алдаа:`, err.message);
    return res.status(400).json({ error: err.message });
  }
});

// ❌ DELETE
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    return res.json({ message: "✅ Мэдээ устгагдлаа" });
  } catch (err) {
    console.error(`❌ DELETE /api/news/${req.params.id} алдаа:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
