const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// =========================
// EMAIL CONFIGURATION
// =========================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// =========================
// GENERATE OTP
// =========================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// =========================
// SEND OTP
// =========================

const sendOTP = async (req, res) => {
  try {
    const { email, role } = req.body;

    // Validate input
    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required",
      });
    }

    // Validate role
    if (!["creator", "brand"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Normalize email
    const cleanEmail = email.toLowerCase().trim();

    // =========================
    // CHECK EXISTING USER
    // =========================

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    // =========================
    // EXISTING USER ROLE CHECK
    // =========================

    if (existingUser) {
      // Same email cannot switch between Creator and Brand
      if (existingUser.role !== role) {
        const existingRole =
          existingUser.role === "creator"
            ? "Creator"
            : "Brand";

        return res.status(409).json({
          message: `This email is already registered as a ${existingRole} account. Please select ${existingRole} to continue.`,
        });
      }
    }

    // =========================
    // GENERATE OTP
    // =========================

    const otp = generateOTP();

    // OTP expires in 5 minutes
    const otpExpiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    let user;
    let isNewUser = false;

    // =========================
    // NEW USER
    // =========================

    if (!existingUser) {
      user = await User.create({
        email: cleanEmail,
        role,
        otp,
        otpExpiresAt,
        isVerified: false,
      });

      isNewUser = true;
    }

    // =========================
    // EXISTING USER
    // =========================

    else {
      user = existingUser;

      // Existing account role must remain permanent
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;

      await user.save();
    }

    // =========================
    // SEND EMAIL
    // =========================

    const mailResult = await transporter.sendMail({
      from: `"Creator Bridge" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your Creator Bridge Verification Code",

      // Plain text fallback
      text: `Your Creator Bridge verification code is ${otp}. This code will expire in 5 minutes.`,

      // HTML email
      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f9fafb;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                padding: 40px 20px;
              "
            >
              <div
                style="
                  max-width: 500px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border: 1px solid #e5e7eb;
                  border-radius: 16px;
                  padding: 35px;
                "
              >

                <h1
                  style="
                    text-align: center;
                    margin: 0 0 10px 0;
                    color: #111827;
                    font-size: 28px;
                  "
                >
                  Creator<span style="color: #9333ea;">Bridge</span>
                </h1>

                <h2
                  style="
                    text-align: center;
                    color: #111827;
                    margin-top: 25px;
                  "
                >
                  Verify your email
                </h2>

                <p
                  style="
                    text-align: center;
                    color: #6b7280;
                    font-size: 15px;
                    line-height: 1.6;
                  "
                >
                  Use the verification code below to continue
                  with Creator Bridge.
                </p>

                <div
                  style="
                    text-align: center;
                    margin: 30px 0;
                  "
                >
                  <div
                    style="
                      display: inline-block;
                      background-color: #f3e8ff;
                      color: #7e22ce;
                      font-size: 32px;
                      font-weight: bold;
                      letter-spacing: 8px;
                      padding: 18px 25px;
                      border-radius: 12px;
                    "
                  >
                    ${otp}
                  </div>
                </div>

                <p
                  style="
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  This verification code will expire in
                  <strong>5 minutes</strong>.
                </p>

                <p
                  style="
                    text-align: center;
                    color: #9ca3af;
                    font-size: 12px;
                    margin-top: 30px;
                    line-height: 1.5;
                  "
                >
                  If you didn't request this code,
                  you can safely ignore this email.
                </p>

              </div>
            </div>
          </body>
        </html>
      `,
    });

    // =========================
    // EMAIL DELIVERY DEBUG
    // =========================

    console.log("");
    console.log("======================================");
    console.log("        CREATOR BRIDGE EMAIL DEBUG");
    console.log("======================================");

    console.log("Recipient:", cleanEmail);
    console.log("Message ID:", mailResult.messageId);
    console.log("Accepted:", mailResult.accepted);
    console.log("Rejected:", mailResult.rejected);
    console.log("Response:", mailResult.response);

    console.log("======================================");
    console.log("OTP email send operation completed ✅");
    console.log("======================================");
    console.log("");

    // =========================
    // RESPONSE
    // =========================

    res.json({
      message: isNewUser
        ? "OTP sent successfully. Please verify your email to create your account."
        : "OTP sent successfully. Please verify your email to login.",

      isNewUser,

      role: user.role,
    });
  } catch (error) {
    // =========================
    // ERROR DEBUG
    // =========================

    console.error("");
    console.error("======================================");
    console.error("        OTP EMAIL ERROR ❌");
    console.error("======================================");

    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.code) {
      console.error("Error code:", error.code);
    }

    if (error.response) {
      console.error("SMTP response:", error.response);
    }

    console.error("======================================");
    console.error("");

    res.status(500).json({
      message: "Failed to send OTP email",
    });
  }
};

// =========================
// VERIFY OTP
// =========================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    // Validate input
    if (!email || !otp || !role) {
      return res.status(400).json({
        message: "Email, OTP and role are required",
      });
    }

    // Validate role
    if (!["creator", "brand"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Normalize email
    const cleanEmail = email.toLowerCase().trim();

    // =========================
    // FIND USER
    // =========================

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        message:
          "Account not found. Please request a new OTP.",
      });
    }

    // =========================
    // CHECK ROLE
    // =========================

    // Existing account role cannot be changed
    if (user.role !== role) {
      const existingRole =
        user.role === "creator"
          ? "Creator"
          : "Brand";

      return res.status(409).json({
        message: `This email belongs to a ${existingRole} account. Please continue as ${existingRole}.`,
      });
    }

    // =========================
    // CHECK OTP
    // =========================

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // =========================
    // CHECK EXPIRY
    // =========================

    if (
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // =========================
    // VERIFY USER
    // =========================

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    // =========================
    // GENERATE JWT
    // =========================

    const token = jwt.sign(
      {
        id: user._id,
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =========================
    // RESPONSE
    // =========================

    res.json({
      message: "OTP verified successfully",

      token,

      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(
      "Verify OTP error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to verify OTP",
    });
  }
};

// =========================
// EXPORT
// =========================

module.exports = {
  sendOTP,
  verifyOTP,
  transporter,
};