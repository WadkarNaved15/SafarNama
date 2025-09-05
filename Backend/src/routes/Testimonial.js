import express from "express";
import Testimonial from "../models/Testimonials.js";

const router = express.Router();

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials (with optional filters)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const filters = {};

    // Optional filters (example: by rating or location)
    if (req.query.location) filters.location = req.query.location;
    if (req.query.minRating) filters.rating = { $gte: Number(req.query.minRating) };

    const testimonials = await Testimonial.find(filters);
    res.json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Server error while fetching testimonials" });
  }
});

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get a single testimonial by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ id: req.params.id });
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (err) {
    console.error("Error fetching testimonial:", err);
    res.status(500).json({ error: "Server error while fetching testimonial" });
  }
});

export default router;
