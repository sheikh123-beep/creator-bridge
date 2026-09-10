const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    instagram: {
      username: {
        type: String,
        default: "",
      },
      followers: {
        type: Number,
        default: 0,
      },
    },

    youtube: {
      channel: {
        type: String,
        default: "",
      },
      subscribers: {
        type: Number,
        default: 0,
      },
    },

    location: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Creator", creatorSchema);