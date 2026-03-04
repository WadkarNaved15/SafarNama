import express from "express";
import Package from "../models/Package.js";

const router = express.Router();

/**
 * @route   GET /api/v1/packages
 * @desc    Get all packages (with optional filters)
 * @access  Public
 */
// GET /api/v1/packages
router.get("/", async (req, res) => {
  try {
    const filters = {};
    console.log("Received query parameters:", req.query);

    // Search must also match
    if (req.query.q) {
      filters.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { destination: { $regex: req.query.q, $options: "i" } },
        { description: { $regex: req.query.q, $options: "i" } },
      ];
    }

    if (req.query.destination) filters.destination = req.query.destination;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;
    if (req.query.duration) filters.duration = req.query.duration;

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      filters.rating = { $gte: Number(req.query.rating) };
    }

    console.log("Package Filters applied:", JSON.stringify(filters, null, 2));

    const packages = await Package.find(filters);
    res.json(packages);
  } catch (err) {
    console.error("Error fetching packages:", err);
    res.status(500).json({ error: "Server error while fetching packages" });
  }
});


/**
 * @route   GET /api/v1/packages/:id
 * @desc    Get a single package by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);
    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(packageData);
  } catch (err) {
    console.error("Error fetching package:", err);
    res.status(500).json({ error: "Server error while fetching package" });
  }
});

/**
 * @route   GET /api/v1/packages/:destination
 * @desc    Get all the packages for a specific destination
 * @access  Public
 */

router.get("/destination/:destination", async (req, res) => {
  try {
    const { destination } = req.params;

    // Case-insensitive match for destination
    const packages = await Package.find({
      destination: { $regex: new RegExp(`^${destination}$`, "i") }
    });

    if (!packages || packages.length === 0) {
      return res.status(404).json({ error: `No packages found for destination: ${destination}` });
    }

    res.json(packages);
  } catch (err) {
    console.error("Error fetching packages by destination:", err);
    res.status(500).json({ error: "Server error while fetching packages by destination" });
  }
});

export default router;
