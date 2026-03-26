import express from "express";
import multer from "multer";

const router = express.Router();

// Store in memory — we only need the buffer for base64, no disk storage needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPEG, PNG, and WEBP images are allowed."));
  },
});

/**
 * @route   POST /api/v1/upload
 * @desc    Upload an image and return base64 + mimeType
 * @access  Public
 */
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const base64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    res.json({ base64, mimeType });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process image." });
  }
});

export default router;