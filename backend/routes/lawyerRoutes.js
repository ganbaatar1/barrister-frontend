//const requireAuth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Lawyer = require("../models/Lawyer");

// 🗂 Зургийн хадгалах тохиргоо
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Зөвхөн зураг оруулна уу"));
    }
    cb(null, true);
  },
});

// ✅ Хуульч нэмэх
router.post("/", requireAuth, upload.single("profilePhoto"), async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      specialization,
      languages,
      academicDegree,
      experience,
      startDate,
      status,
    } = req.body;

    if (!lastName || !firstName) {
      return res.status(400).json({ error: "Овог болон нэр заавал" });
    }

    const newLawyer = new Lawyer({
      lastName,
      firstName,
      specialization: JSON.parse(specialization || "[]"),
      languages: JSON.parse(languages || "[]"),
      academicDegree,
      experience,
      startDate,
      status,
      profilePhoto: req.file
        ? `/uploads/${req.file.filename}`
        : `/uploads/default-profile.png`, // ✅ Default зураг заавал ашиглах
    });

    const saved = await newLawyer.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Хуульч нэмэх алдаа:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Хуульч шинэчлэх
router.put("/:id", requireAuth, upload.single("profilePhoto"), async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      specialization,
      languages,
      academicDegree,
      experience,
      startDate,
      status,
    } = req.body;

    const update = {
      lastName,
      firstName,
      specialization: JSON.parse(specialization || "[]"),
      languages: JSON.parse(languages || "[]"),
      academicDegree,
      experience,
      startDate,
      status,
    };

    if (req.file) {
      update.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const result = await Lawyer.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Хуульч шинэчлэх алдаа:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Бүх хуульч авах
router.get("/", async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.json(lawyers);
  } catch (err) {
    console.error("❌ Хуульч жагсаалт татах алдаа:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Нэг хуульч ID-р авах
router.get("/:id", async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ error: "Хуульч олдсонгүй" });
    }
    res.json(lawyer);
  } catch (err) {
    console.error("❌ Хуульч авахад алдаа:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Хуульч устгах
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Lawyer.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Амжилттай устгалаа" });
  } catch (err) {
    console.error("❌ Хуульч устгах алдаа:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
