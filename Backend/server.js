const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const { transporter } = require("./controllers/authController");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const aiRoutes = require("./routes/aiRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const creatorRoutes = require("./routes/creatorRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// MONGODB
// =========================

connectDB();

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Creator Bridge Backend is running 🚀",
  });
});

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/creators", creatorRoutes);

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // =========================
  // SMTP CHECK
  // =========================

  transporter.verify((error) => {
    if (error) {
      console.error("SMTP connection failed ❌");
      console.error(error.message);
    } else {
      console.log("SMTP server ready ✅");
    }
  });
});