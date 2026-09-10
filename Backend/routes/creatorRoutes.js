const express = require("express");

const Creator = require("../models/Creator");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------
// GET ALL CREATORS
// --------------------------------------------------

router.get("/", authMiddleware, async (req, res) => {
  try {
    const creators = await Creator.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      creators,
    });
  } catch (error) {
    console.error("Fetch creators error:", error);

    res.status(500).json({
      message: "Failed to fetch creators",
    });
  }
});

// --------------------------------------------------
// GET SINGLE CREATOR
// --------------------------------------------------

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);

    if (!creator) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    res.json({
      creator,
    });
  } catch (error) {
    console.error("Fetch creator error:", error);

    res.status(500).json({
      message: "Failed to fetch creator",
    });
  }
});

module.exports = router;