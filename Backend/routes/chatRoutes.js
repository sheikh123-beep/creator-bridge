const express = require("express");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Application = require("../models/Application");
const Creator = require("../models/Creator");
const Brand = require("../models/Brand");
const Campaign = require("../models/Campaign");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// CREATE / GET CONVERSATION
// Supports:
// 1. Application-based chat
// 2. Direct brand -> creator chat
// ======================================================

router.post(
  "/conversations",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        applicationId,
        creatorId,
        campaignId,
      } = req.body;

      // ==================================================
      // GET LOGGED-IN USER PROFILE
      // ==================================================

      const creator = await Creator.findOne({
        userId: req.user.id,
      });

      const brand = await Brand.findOne({
        userId: req.user.id,
      });

      // ==================================================
      // APPLICATION CHAT
      // ==================================================

      if (applicationId) {
        const application =
          await Application.findById(applicationId);

        if (!application) {
          return res.status(404).json({
            message: "Application not found",
          });
        }

        let isParticipant = false;

        if (
          req.user.role === "creator" &&
          creator &&
          String(application.creatorId) ===
            String(creator._id)
        ) {
          isParticipant = true;
        }

        if (
          req.user.role === "brand" &&
          brand &&
          String(application.brandId) ===
            String(brand._id)
        ) {
          isParticipant = true;
        }

        if (!isParticipant) {
          return res.status(403).json({
            message:
              "You are not a participant in this conversation",
          });
        }

        let conversation =
          await Conversation.findOne({
            applicationId: application._id,
          })
            .populate(
              "campaignId",
              "title category platform budget"
            )
            .populate(
              "creatorId",
              "name username category profileImage"
            )
            .populate(
              "brandId",
              "companyName industry"
            );

        if (!conversation) {
          conversation =
            await Conversation.create({
              applicationId:
                application._id,

              campaignId:
                application.campaignId,

              creatorId:
                application.creatorId,

              brandId:
                application.brandId,
            });

          conversation =
            await Conversation.findById(
              conversation._id
            )
              .populate(
                "campaignId",
                "title category platform budget"
              )
              .populate(
                "creatorId",
                "name username category profileImage"
              )
              .populate(
                "brandId",
                "companyName industry"
              );
        }

        return res.status(200).json({
          message: "Conversation ready",
          conversation,
        });
      }

      // ==================================================
      // DIRECT BRAND -> CREATOR CHAT
      // ==================================================

      if (!creatorId || !campaignId) {
        return res.status(400).json({
          message:
            "Application ID or creator ID and campaign ID are required",
        });
      }

      // Direct chat sirf brand start karega
      if (req.user.role !== "brand") {
        return res.status(403).json({
          message:
            "Only brands can start a direct conversation with a creator",
        });
      }

      if (!brand) {
        return res.status(404).json({
          message: "Brand profile not found",
        });
      }

      const targetCreator =
        await Creator.findById(creatorId);

      if (!targetCreator) {
        return res.status(404).json({
          message: "Creator not found",
        });
      }

      const campaign =
        await Campaign.findById(campaignId);

      if (!campaign) {
        return res.status(404).json({
          message: "Campaign not found",
        });
      }

      // Campaign kisi aur brand ki nahi honi chahiye
      if (
        String(campaign.brandId) !==
        String(brand._id)
      ) {
        return res.status(403).json({
          message:
            "You can only start chats for your own campaigns",
        });
      }

      // Existing direct conversation check
      let conversation =
        await Conversation.findOne({
          applicationId: null,
          campaignId: campaign._id,
          creatorId: targetCreator._id,
          brandId: brand._id,
        })
          .populate(
            "campaignId",
            "title category platform budget"
          )
          .populate(
            "creatorId",
            "name username category profileImage"
          )
          .populate(
            "brandId",
            "companyName industry"
          );

      // Create direct conversation
      if (!conversation) {
        conversation =
          await Conversation.create({
            applicationId: null,

            campaignId:
              campaign._id,

            creatorId:
              targetCreator._id,

            brandId:
              brand._id,
          });

        conversation =
          await Conversation.findById(
            conversation._id
          )
            .populate(
              "campaignId",
              "title category platform budget"
            )
            .populate(
              "creatorId",
              "name username category profileImage"
            )
            .populate(
              "brandId",
              "companyName industry"
            );
      }

      return res.status(200).json({
        message: "Conversation ready",
        conversation,
      });
    } catch (error) {
      console.error(
        "Create/get conversation failed ❌"
      );
      console.error(error.message);

      res.status(500).json({
        message:
          "Failed to create/get conversation",
        error: error.message,
      });
    }
  }
);

// ======================================================
// GET MY CONVERSATIONS
// ======================================================

router.get(
  "/conversations",
  authMiddleware,
  async (req, res) => {
    try {
      const creator =
        await Creator.findOne({
          userId: req.user.id,
        });

      const brand =
        await Brand.findOne({
          userId: req.user.id,
        });

      let filter = {};

      if (req.user.role === "creator") {
        if (!creator) {
          return res.status(404).json({
            message:
              "Creator profile not found",
          });
        }

        filter.creatorId =
          creator._id;
      } else if (req.user.role === "brand") {
        if (!brand) {
          return res.status(404).json({
            message:
              "Brand profile not found",
          });
        }

        filter.brandId =
          brand._id;
      } else {
        return res.status(403).json({
          message: "Invalid role",
        });
      }

      const conversations =
        await Conversation.find(filter)
          .populate(
            "campaignId",
            "title category platform budget"
          )
          .populate(
            "creatorId",
            "name username category profileImage"
          )
          .populate(
            "brandId",
            "companyName industry"
          )
          .sort({ updatedAt: -1 });

      res.status(200).json({
        conversations,
      });
    } catch (error) {
      console.error(
        "Get conversations failed ❌"
      );

      console.error(error.message);

      res.status(500).json({
        message:
          "Failed to fetch conversations",
        error: error.message,
      });
    }
  }
);

// ======================================================
// GET MESSAGES
// ======================================================

router.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  async (req, res) => {
    try {
      const conversation =
        await Conversation.findById(
          req.params.conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found",
        });
      }

      const creator =
        await Creator.findOne({
          userId: req.user.id,
        });

      const brand =
        await Brand.findOne({
          userId: req.user.id,
        });

      let isParticipant = false;

      if (
        req.user.role === "creator" &&
        creator &&
        String(conversation.creatorId) ===
          String(creator._id)
      ) {
        isParticipant = true;
      }

      if (
        req.user.role === "brand" &&
        brand &&
        String(conversation.brandId) ===
          String(brand._id)
      ) {
        isParticipant = true;
      }

      if (!isParticipant) {
        return res.status(403).json({
          message:
            "You do not have access to this conversation",
        });
      }

      const messages =
        await Message.find({
          conversationId:
            conversation._id,
        })
          .populate(
            "senderId",
            "email"
          )
          .sort({ createdAt: 1 });

      res.status(200).json({
        messages,
      });
    } catch (error) {
      console.error(
        "Get messages failed ❌"
      );

      console.error(error.message);

      res.status(500).json({
        message:
          "Failed to fetch messages",
        error: error.message,
      });
    }
  }
);

// ======================================================
// SEND MESSAGE
// ======================================================

router.post(
  "/conversations/:conversationId/messages",
  authMiddleware,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          message:
            "Message text is required",
        });
      }

      const conversation =
        await Conversation.findById(
          req.params.conversationId
        );

      if (!conversation) {
        return res.status(404).json({
          message:
            "Conversation not found",
        });
      }

      const creator =
        await Creator.findOne({
          userId: req.user.id,
        });

      const brand =
        await Brand.findOne({
          userId: req.user.id,
        });

      let isParticipant = false;

      if (
        req.user.role === "creator" &&
        creator &&
        String(conversation.creatorId) ===
          String(creator._id)
      ) {
        isParticipant = true;
      }

      if (
        req.user.role === "brand" &&
        brand &&
        String(conversation.brandId) ===
          String(brand._id)
      ) {
        isParticipant = true;
      }

      if (!isParticipant) {
        return res.status(403).json({
          message:
            "You do not have access to this conversation",
        });
      }

      const message =
        await Message.create({
          conversationId:
            conversation._id,

          senderId:
            req.user.id,

          senderRole:
            req.user.role,

          text: text.trim(),
        });

      conversation.updatedAt =
        new Date();

      await conversation.save();

      const populatedMessage =
        await Message.findById(
          message._id
        ).populate(
          "senderId",
          "email"
        );

      res.status(201).json({
        message:
          "Message sent successfully",

        data: populatedMessage,
      });
    } catch (error) {
      console.error(
        "Send message failed ❌"
      );

      console.error(error.message);

      res.status(500).json({
        message:
          "Failed to send message",
        error: error.message,
      });
    }
  }
);

module.exports = router;