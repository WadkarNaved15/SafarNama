// routes/destinationRoutes.js
import express from "express";
import Destination from "../models/Destination.js";
import Package from "../models/Package.js";

const router = express.Router();

/**
 * @route   GET /api/v1/destinations
 * @desc    Get all destinations (with optional query filters)
 * @access  Public
 */
// GET /api/v1/destinations
// GET /api/v1/destinations
router.get("/", async (req, res) => {
  try {
    const filters = {};
   const count = await Destination.countDocuments();
console.log("Number of destinations:", count);


    // Text search must match as well if provided
    if (req.query.q) {
      filters.$or = [
        { name: { $regex: req.query.q, $options: "i" } },
        { country: { $regex: req.query.q, $options: "i" } },
        { region: { $regex: req.query.q, $options: "i" } },
      ];
    }

    if (req.query.region) {
        filters.region = { $regex: `^${req.query.region}$`, $options: "i" };
      }
      if (req.query.theme) {
        filters.theme = { $regex: `^${req.query.theme}$`, $options: "i" };
      }
      if (req.query.season) {
        filters.season = { $regex: `^${req.query.season}$`, $options: "i" };
      }
      if (req.query.country) {
        filters.country = { $regex: `^${req.query.country}$`, $options: "i" };
      }


console.log("Destination Filters applied:", JSON.stringify(filters, null, 2));


    const destinations = await Destination.find(filters);
    console.log(`Fetched ${destinations.length} destinations`);
    res.json(destinations);
  } catch (err) {
    console.error("Error fetching destinations:", err);
    res.status(500).json({ error: "Server error while fetching destinations" });
  }
});



/**
 * @route   GET /api/v1/destinations/:id
 * @desc    Get a single destination by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }
    const packages = await Package.find({
      destination: { $regex: new RegExp(`^${destination.name}$`, "i") }
    });
    res.json({
      destination,
      packages
    });
  } catch (err) {
    console.error("Error fetching destination:", err);
    res.status(500).json({ error: "Server error while fetching destination" });
  }
});

// router.get("/:id", async (req, res) => {
//    try {
//     const destination = await Destination.findById(req.params.id);
//     const packages = await Package.find({ destinationId });
//     res.json(packages);
//   } catch (err) {
//     console.error("Error fetching packages for destination:", err);
//     res.status(500).json({ error: "Server error while fetching packages" });
//   }
// });

export default router;
