import express from "express";
import Agent from "../models/Agent.js";

const router = express.Router();

/**
 * @route   GET /api/agents
 * @desc    Get all agents (with optional filters)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const filters = {};

    // Example filters
    if (req.query.company) filters.company = req.query.company;
    if (req.query.language) filters.languages = req.query.language;
    if (req.query.verified) filters.verified = req.query.verified === "true";

    const agents = await Agent.find(filters).populate("packages"); 
    res.json(agents);
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).json({ error: "Server error while fetching agents" });
  }
});

/**
 * @route   GET /api/agents/:id
 * @desc    Get a single agent by ID (with packages populated)
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching agent with ID:", req.params.id);
    const agent = await Agent.findById(req.params.id).populate("packages");
    console.log("Fetched Agent:", agent);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
  } catch (err) {
    console.error("Error fetching agent:", err);
    res.status(500).json({ error: "Server error while fetching agent" });
  }
});

/**
 * @route   PUT /api/v1/agents/:agentId/add-package/:packageId
 * @desc    Link a package to an agent
 * @access  Public
 */

router.put("/:agentId/add-package/:packageId", async (req, res) => {
  try {
    const { agentId, packageId } = req.params;

    const updatedAgent = await Agent.findByIdAndUpdate(
      agentId,
      { $addToSet: { packages: packageId } }, // prevents duplicates
      { new: true }
    ).populate("packages");

    if (!updatedAgent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    res.json(updatedAgent);
  } catch (err) {
    console.error("Error linking package to agent:", err);
    res.status(500).json({ error: "Server error while linking package" });
  }
});


export default router;
