const express = require("express");

const {
  generateCampaign,
  matchCreators,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate-campaign",
  authMiddleware,
  generateCampaign
);

router.post(
  "/match-creators",
  authMiddleware,
  matchCreators
);

module.exports = router;