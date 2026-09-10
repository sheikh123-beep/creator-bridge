const express = require("express");

const Application = require("../models/Application");
const Campaign = require("../models/Campaign");
const Creator = require("../models/Creator");
const Brand = require("../models/Brand");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE APPLICATION — CREATOR
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({
        message: "Only creators can apply to campaigns",
      });
    }

    const { campaignId, message } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        message: "Campaign ID is required",
      });
    }

    const creator = await Creator.findOne({
      userId: req.user.id,
    });

    if (!creator) {
      return res.status(404).json({
        message: "Creator profile not found",
      });
    }

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    if (campaign.status !== "active") {
      return res.status(400).json({
        message: "This campaign is not accepting applications",
      });
    }

    const existingApplication = await Application.findOne({
      campaignId,
      creatorId: creator._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied to this campaign",
      });
    }

    const application = await Application.create({
      campaignId,
      creatorId: creator._id,
      brandId: campaign.brandId,
      message: message || "",
      status: "pending",
    });

    const populatedApplication = await Application.findById(
      application._id
    )
      .populate("campaignId", "title category budget platform")
      .populate(
        "creatorId",
        "name username category instagram youtube location price"
      )
      .populate(
        "brandId",
        "companyName industry location website"
      );

    res.status(201).json({
      message: "Application submitted successfully 🎉",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Create application failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
});

// ==========================================
// GET MY APPLICATIONS — CREATOR
// ==========================================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({
        message: "Only creators can view their applications",
      });
    }

    const creator = await Creator.findOne({
      userId: req.user.id,
    });

    if (!creator) {
      return res.status(404).json({
        message: "Creator profile not found",
      });
    }

    const applications = await Application.find({
      creatorId: creator._id,
    })
      .populate("campaignId", "title category budget platform status")
      .populate("brandId", "companyName industry location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("Get creator applications failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

// ==========================================
// GET RECEIVED APPLICATIONS — BRAND
// ==========================================
router.get("/received", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "brand") {
      return res.status(403).json({
        message: "Only brands can view received applications",
      });
    }

    const brand = await Brand.findOne({
      userId: req.user.id,
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand profile not found",
      });
    }

    const applications = await Application.find({
      brandId: brand._id,
    })
      .populate(
        "campaignId",
        "title category budget platform status"
      )
      .populate(
        "creatorId",
        "name username bio category instagram youtube location price"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error("Get received applications failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch received applications",
      error: error.message,
    });
  }
});

// ==========================================
// ACCEPT / REJECT APPLICATION — BRAND
// ==========================================
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "brand") {
      return res.status(403).json({
        message: "Only brands can update application status",
      });
    }

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected",
      });
    }

    const brand = await Brand.findOne({
      userId: req.user.id,
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand profile not found",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      brandId: brand._id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication = await Application.findById(
      application._id
    )
      .populate("campaignId", "title category budget platform status")
      .populate(
        "creatorId",
        "name username category instagram youtube location price"
      )
      .populate(
        "brandId",
        "companyName industry location"
      );

    res.status(200).json({
      message: `Application ${status} successfully`,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
});

module.exports = router;