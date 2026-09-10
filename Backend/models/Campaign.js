const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      default: "Instagram",
      trim: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    minFollowers: {
      type: Number,
      default: 0,
      min: 0,
    },

    requirements: {
      type: String,
      default: "",
      trim: true,
    },

    // 🎯 Target Audience
    audience: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "closed", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);