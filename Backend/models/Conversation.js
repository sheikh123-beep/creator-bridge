const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Application-based chat ke liye applicationId hoga.
    // Direct brand -> creator chat mein null hoga.
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
      unique: true,
      sparse: true,
    },

    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);