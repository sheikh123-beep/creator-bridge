import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("creator");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  // =========================
  // CHECK EXISTING LOGIN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);

        if (user.role === "creator") {
          navigate("/creator-dashboard", {
            replace: true,
          });
        } else if (user.role === "brand") {
          navigate("/brand-dashboard", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(
          "Saved user data error:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    }
  }, [navigate]);

  // =========================
  // CONTINUE
  // =========================

  const handleContinue = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://creator-bridge-backend.onrender.com/api/auth/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to continue"
        );
      }

      // =========================
      // GO TO OTP
      // =========================

      navigate("/otp", {
        state: {
          email: cleanEmail,
          role,
          isNewUser: data.isNewUser,
        },
      });
    } catch (error) {
      console.error(
        "Login/OTP error:",
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
  // CREATE ACCOUNT
  // =========================

  const handleCreateAccountClick = () => {
    setIsRegistering(true);
    setError("");
  };

  // =========================
  // LOGIN
  // =========================

  const handleLoginClick = () => {
    setIsRegistering(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}

        <Link
          to="/"
          className="block text-center text-2xl font-bold mb-8"
        >
          Creator
          <span className="text-purple-600">
            Bridge
          </span>
        </Link>

        {/* Card */}

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

          {/* Heading */}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              {isRegistering
                ? "Create your account"
                : "Welcome back"}
            </h1>

            <p className="text-gray-500 mt-2">
              {isRegistering
                ? "Join Creator Bridge and get started"
                : "Login to continue to Creator Bridge"}
            </p>
          </div>

          {/* Role Selection */}

          <div className="grid grid-cols-2 gap-3 mb-6">

            {/* Creator */}

            <button
              type="button"
              onClick={() => {
                setRole("creator");
                setError("");
              }}
              className={`p-4 rounded-xl border text-left transition ${
                role === "creator"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="text-2xl mb-2">
                👤
              </div>

              <p className="font-semibold">
                Creator
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Find brand opportunities
              </p>
            </button>

            {/* Brand */}

            <button
              type="button"
              onClick={() => {
                setRole("brand");
                setError("");
              }}
              className={`p-4 rounded-xl border text-left transition ${
                role === "brand"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="text-2xl mb-2">
                🏢
              </div>

              <p className="font-semibold">
                Brand
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Find amazing creators
              </p>
            </button>
          </div>

          {/* Email Form */}

          <form onSubmit={handleContinue}>

            <label className="block text-sm font-medium mb-2">
              Email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />

            {/* Error */}

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Continue */}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 py-3.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Checking email..."
                : isRegistering
                ? "Create Account with Email →"
                : "Continue with Email →"}
            </button>
          </form>

          {/* Info */}

          <p className="text-center text-xs text-gray-400 mt-6">
            {isRegistering
              ? "We'll verify your email with a one-time OTP."
              : "Returning users stay logged in until they logout."}
          </p>
        </div>

        {/* Login / Register Switch */}

        <p className="text-center text-sm text-gray-500 mt-6">

          {isRegistering ? (
            <>
              Already have an account?{" "}

              <button
                type="button"
                onClick={handleLoginClick}
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New to Creator Bridge?{" "}

              <button
                type="button"
                onClick={handleCreateAccountClick}
                className="text-purple-600 font-semibold hover:text-purple-700"
              >
                Create an account
              </button>
            </>
          )}

        </p>
      </div>
    </div>
  );
}

export default Login;