const express = require("express");

const Campaign = require("../models/Campaign");
const Brand = require("../models/Brand");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE CAMPAIGN
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Only brands can create campaigns
    if (req.user.role !== "brand") {
      return res.status(403).json({
        message: "Only brands can create campaigns",
      });
    }

    const {
      title,
      description,
      category,
      platform,
      budget,
      minFollowers,
      requirements,
      audience,
      status,
    } = req.body;

    // Required field validation
    if (!title || !description || !category || budget === undefined) {
      return res.status(400).json({
        message: "Title, description, category and budget are required",
      });
    }

    // Find logged-in brand profile
    const brand = await Brand.findOne({
      userId: req.user.id,
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand profile not found",
      });
    }

    // Create campaign
    const campaign = await Campaign.create({
      brandId: brand._id,

      title: title.trim(),

      description: description.trim(),

      category: category.trim(),

      platform: platform || "Instagram",

      budget: Number(budget),

      minFollowers: Number(minFollowers) || 0,

      requirements: requirements || "",

      // 🎯 Target Audience
      audience: audience || "",

      status: status || "active",
    });

    res.status(201).json({
      message: "Campaign created successfully 🎉",
      campaign,
    });
  } catch (error) {
    console.error("Create campaign failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to create campaign",
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL CAMPAIGNS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate(
        "brandId",
        "companyName description industry location website"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      campaigns,
    });
  } catch (error) {
    console.error("Get campaigns failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE CAMPAIGN
// ==========================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "brandId",
      "companyName description industry location website"
    );

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      campaign,
    });
  } catch (error) {
    console.error("Get campaign failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch campaign",
      error: error.message,
    });
  }
});

module.exports = router;