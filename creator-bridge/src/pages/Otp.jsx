import { useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const role = location.state?.role || "";
  const isNewUser =
    location.state?.isNewUser ?? true;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !role) {
      alert(
        "Session expired. Please login again."
      );

      navigate("/login");
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Please enter a valid 6-digit OTP."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "OTP verification failed"
        );
      }

      // =========================
      // SAVE JWT
      // =========================

      localStorage.setItem(
        "token",
        data.token
      );

      // =========================
      // SAVE USER
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // =========================
      // SAVE ACTUAL ROLE
      // =========================

      localStorage.setItem(
        "role",
        data.user.role
      );

      // =========================
      // NEW USER
      // =========================

      if (isNewUser) {
        alert(
          "Email verified successfully! 🎉"
        );

        if (data.user.role === "creator") {
          navigate("/creator-profile", {
            replace: true,
          });
        } else if (
          data.user.role === "brand"
        ) {
          navigate("/brand-profile", {
            replace: true,
          });
        } else {
          navigate("/login", {
            replace: true,
          });
        }

        return;
      }

      // =========================
      // EXISTING USER
      // =========================

      alert("Welcome back! 🎉");

      if (data.user.role === "creator") {
        navigate("/creator-dashboard", {
          replace: true,
        });
      } else if (
        data.user.role === "brand"
      ) {
        navigate("/brand-dashboard", {
          replace: true,
        });
      } else {
        navigate("/login", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResendOtp = async () => {
    if (!email || !role) {
      alert(
        "Session expired. Please login again."
      );

      navigate("/login");
      return;
    }

    try {
      setResending(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to resend OTP"
        );
      }

      setOtp("");

      alert(
        "New OTP sent to your email! 📩"
      );
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      setError(
        error.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* Logo */}

          <div className="text-center mb-8">

            <Link
              to="/"
              className="text-2xl font-bold text-purple-600"
            >
              Creator Bridge
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mt-8">
              Verify your email
            </h1>

            <p className="text-gray-500 mt-2">
              Enter the 6-digit verification code
              sent to:
            </p>

            <p className="font-semibold text-gray-900 mt-2 break-all">
              {email}
            </p>

            {/* Account Type */}

            <p className="text-xs text-gray-400 mt-3">
              {isNewUser
                ? `Creating a ${role} account`
                : `Logging in to your ${role} account`}
            </p>
          </div>

          {/* OTP Form */}

          <form onSubmit={handleVerify}>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Verification Code
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setOtp(value);
                setError("");
              }}
              placeholder="Enter 6-digit OTP"
              autoFocus
              className="w-full border border-gray-300 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />

            {/* Error */}

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-red-600 text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Verify */}

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="w-full mt-6 px-6 py-3.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP →"}
            </button>
          </form>

          {/* Resend */}

          <div className="text-center mt-6">

            <p className="text-sm text-gray-500">
              Didn't receive the OTP?
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="mt-2 text-purple-600 font-semibold hover:text-purple-700 disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : "Resend OTP"}
            </button>
          </div>

          {/* Back */}

          <div className="text-center mt-6">

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="text-sm text-gray-500 hover:text-purple-600"
            >
              ← Back to Login
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;