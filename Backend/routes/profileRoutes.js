const express = require("express");

const Creator = require("../models/Creator");
const Brand = require("../models/Brand");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// CREATOR PROFILE
// =========================

router.post("/creator", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      username,
      bio,
      category,
      instagramUsername,
      instagramFollowers,
      youtubeChannel,
      youtubeSubscribers,
      location,
      price,
    } = req.body;

    if (!name || !username || !category) {
      return res.status(400).json({
        message: "Name, username and category are required",
      });
    }

    const creatorData = {
      userId: req.user.id,
      name,
      username,
      bio: bio || "",
      category,
      instagram: {
        username: instagramUsername || "",
        followers: Number(instagramFollowers) || 0,
      },
      youtube: {
        channel: youtubeChannel || "",
        subscribers: Number(youtubeSubscribers) || 0,
      },
      location: location || "",
      price: Number(price) || 0,
    };

    const creator = await Creator.findOneAndUpdate(
      { userId: req.user.id },
      creatorData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Creator profile saved successfully 🎉",
      creator,
    });
  } catch (error) {
    console.error("Creator profile save failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to save creator profile",
      error: error.message,
    });
  }
});

// =========================
// BRAND PROFILE
// =========================

router.post("/brand", authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      description,
      industry,
      location,
      website,
    } = req.body;

    if (!companyName || !industry) {
      return res.status(400).json({
        message: "Company name and industry are required",
      });
    }

    const brandData = {
      userId: req.user.id,
      companyName,
      description: description || "",
      industry,
      location: location || "",
      website: website || "",
    };

    const brand = await Brand.findOneAndUpdate(
      { userId: req.user.id },
      brandData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Brand profile saved successfully 🎉",
      brand,
    });
  } catch (error) {
    console.error("Brand profile save failed ❌");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to save brand profile",
      error: error.message,
    });
  }
});

module.exports = router;