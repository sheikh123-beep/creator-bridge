import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

const API_BASE_URL =
  "https://creator-bridge-backend.onrender.com";

function CreatorPublicProfile() {
  const { id } = useParams();

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [creator, setCreator] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // FETCH CREATOR
  // ==================================================

  useEffect(() => {
    const fetchCreator = async () => {
      if (!token || !id) {
        setLoading(false);

        setError(
          "Creator information is unavailable."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/creators/${id}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch creator"
          );
        }

        setCreator(data.creator);
      } catch (err) {
        console.error(
          "Creator profile error:",
          err
        );

        setError(
          err.message ||
            "Unable to load creator profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, token]);

  // ==================================================
  // FORMAT NUMBERS
  // ==================================================

  const formatNumber = (number) => {
    const value =
      Number(number || 0);

    if (value >= 1000000) {
      return `${(
        value / 1000000
      ).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(
        value / 1000
      ).toFixed(1)}K`;
    }

    return value.toLocaleString(
      "en-IN"
    );
  };

  // ==================================================
  // FORMAT PRICE
  // ==================================================

  const formatPrice = (price) => {
    const value =
      Number(price || 0);

    if (!value) {
      return "Negotiable";
    }

    return `₹${value.toLocaleString(
      "en-IN"
    )}`;
  };

  // ==================================================
  // START DIRECT CONVERSATION
  // ==================================================

  const handleStartConversation = () => {
    if (!token) {
      alert(
        "Please login first."
      );

      navigate("/login");

      return;
    }

    // Direct chat only for brands
    if (
      savedUser?.role !== "brand" &&
      localStorage.getItem("role") !==
        "brand"
    ) {
      alert(
        "Only brands can start a conversation with a creator."
      );

      return;
    }

    // Selected campaign from brand flow
    const selectedCampaign =
      JSON.parse(
        localStorage.getItem(
          "selectedCampaign"
        ) || "null"
      );

    if (!selectedCampaign) {
      alert(
        "Please create or select a campaign first, then start the conversation."
      );

      navigate("/campaigns");

      return;
    }

   const campaignId =
  selectedCampaign.mongoId ||
  selectedCampaign._id;
    if (!campaignId) {
      alert(
        "Campaign information is missing. Please select a campaign again."
      );

      navigate("/campaigns");

      return;
    }

    // Save chat context
    const chatContext = {
      directChat: true,

      creatorId:
        creator._id ||
        creator.id ||
        id,

      creatorName:
        creator.name ||
        "Creator",

      campaignId,

      campaignTitle:
        selectedCampaign.title ||
        "Campaign",

      campaign: {
        _id: campaignId,

        title:
          selectedCampaign.title ||
          "Campaign",
      },
    };

    localStorage.setItem(
      "currentChat",
      JSON.stringify(chatContext)
    );

    // Remove old application context
    localStorage.removeItem(
      "currentApplication"
    );

    navigate("/chat");
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <Link
              to="/"
              className="text-2xl font-bold"
            >
              Creator
              <span className="text-purple-600">
                Bridge
              </span>
            </Link>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">
              ⏳
            </div>

            <h2 className="font-semibold text-gray-900">
              Loading creator profile...
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Fetching profile information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <Link
              to="/"
              className="text-2xl font-bold"
            >
              Creator
              <span className="text-purple-600">
                Bridge
              </span>
            </Link>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-red-200 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">
              😕
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Creator not found
            </h2>

            <p className="text-gray-500 mt-2">
              {error ||
                "This creator profile is unavailable."}
            </p>

            <Link
              to="/creator-discovery"
              className="inline-block mt-6 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              ← Back to Creator Discovery
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ==================================================
  // MAIN PROFILE
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold"
          >
            Creator
            <span className="text-purple-600">
              Bridge
            </span>
          </Link>

          <Link
            to="/creator-discovery"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            ← Creator Discovery
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Profile Header */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* Profile Image */}

            {creator.profileImage ? (
              <img
                src={creator.profileImage}
                alt={creator.name}
                className="w-28 h-28 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center text-5xl">
                👤
              </div>
            )}

            {/* Basic Info */}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {creator.name}
                </h1>

                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  Creator
                </span>
              </div>

              <p className="text-gray-500 mt-1">
                {creator.username
                  ? `@${creator.username.replace(
                      /^@/,
                      ""
                    )}`
                  : "Creator"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {creator.category && (
                  <span className="bg-purple-50 text-purple-600 text-sm font-semibold px-3 py-1.5 rounded-lg">
                    {creator.category}
                  </span>
                )}

                {creator.location && (
                  <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-lg">
                    📍 {creator.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}

          {creator.bio && (
            <div className="mt-7 pt-6 border-t border-gray-100">
              <h2 className="font-bold text-gray-900">
                About
              </h2>

              <p className="text-gray-600 mt-2 leading-relaxed">
                {creator.bio}
              </p>
            </div>
          )}
        </div>

        {/* Social Stats */}

        <div className="grid md:grid-cols-2 gap-5 mt-5">

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-400">
              Instagram
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {formatNumber(
                creator.instagram?.followers
              )}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              followers
            </p>

            {creator.instagram?.username && (
              <p className="text-purple-600 text-sm font-semibold mt-4">
                @
                {creator.instagram.username.replace(
                  /^@/,
                  ""
                )}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-400">
              YouTube
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {formatNumber(
                creator.youtube?.subscribers
              )}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              subscribers
            </p>

            {creator.youtube?.channel && (
              <p className="text-purple-600 text-sm font-semibold mt-4">
                {creator.youtube.channel}
              </p>
            )}
          </div>
        </div>

        {/* Collaboration Info */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-5">
          <h2 className="text-xl font-bold">
            Collaboration Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">
                Starting Price
              </p>

              <p className="text-xl font-bold mt-1">
                {formatPrice(
                  creator.price
                )}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">
                Niche
              </p>

              <p className="text-xl font-bold mt-1">
                {creator.category ||
                  "General"}
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Actions */}

        <div className="mt-6 flex flex-wrap gap-3">

          <Link
            to="/creator-discovery"
            className="bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            ← Back to Creators
          </Link>

          {savedUser?.role === "brand" && (
            <button
              type="button"
              onClick={
                handleStartConversation
              }
              className="bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              💬 Start Conversation
            </button>
          )}

        </div>

      </main>
    </div>
  );
}

export default CreatorPublicProfile;