import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function AIMatching() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] =
    useState("");

  const [campaign, setCampaign] = useState(null);
  const [matches, setMatches] = useState([]);

  const [loadingCampaigns, setLoadingCampaigns] =
    useState(true);

  const [loadingMatching, setLoadingMatching] =
    useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==================================================
  // FETCH BRAND CAMPAIGNS
  // ==================================================

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!token) {
        setLoadingCampaigns(false);
        setError(
          "Please login as a brand to use AI matching."
        );
        return;
      }

      try {
        setLoadingCampaigns(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/campaigns`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load campaigns"
          );
        }

        const realCampaigns =
          data.campaigns || [];

        setCampaigns(realCampaigns);

        // Try selected campaign from localStorage first.
        const savedCampaign = JSON.parse(
          localStorage.getItem(
            "selectedCampaign"
          ) || "null"
        );

        const savedId =
          savedCampaign?.mongoId ||
          savedCampaign?.id;

        const matchingSavedCampaign =
          realCampaigns.find(
            (item) =>
              String(item._id) ===
              String(savedId)
          );

        if (matchingSavedCampaign) {
          setSelectedCampaignId(
            matchingSavedCampaign._id
          );
        } else if (realCampaigns.length > 0) {
          setSelectedCampaignId(
            realCampaigns[0]._id
          );
        }
      } catch (err) {
        console.error(
          "Campaign loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load campaigns."
        );
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, [token]);

  // ==================================================
  // RUN AI MATCHING
  // ==================================================

  const handleMatchCreators = async () => {
    if (!selectedCampaignId) {
      setError(
        "Please select a campaign first."
      );
      return;
    }

    try {
      setLoadingMatching(true);
      setError("");
      setMatches([]);
      setCampaign(null);

      const response = await fetch(
        `${API_BASE_URL}/api/ai/match-creators`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            campaignId:
              selectedCampaignId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "AI matching failed"
        );
      }

      setCampaign(
        data.campaign || null
      );

      setMatches(
        data.matches || []
      );
    } catch (err) {
      console.error(
        "AI matching error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while matching creators."
      );
    } finally {
      setLoadingMatching(false);
    }
  };

  // ==================================================
  // SELECTED CAMPAIGN
  // ==================================================

  const selectedCampaign =
    campaigns.find(
      (item) =>
        String(item._id) ===
        String(selectedCampaignId)
    ) || null;

  // ==================================================
  // FORMAT FOLLOWERS
  // ==================================================

  const formatFollowers = (number) => {
    const value = Number(number) || 0;

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toLocaleString("en-IN");
  };

  // ==================================================
  // MATCH SCORE CLASSES
  // ==================================================

  const getMatchClasses = (match) => {
    if (match >= 85) {
      return "bg-green-50 text-green-700";
    }

    if (match >= 70) {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-red-50 text-red-700";
  };

  // ==================================================
  // OPEN CREATOR PROFILE
  // ==================================================

  const getCreatorProfileLink = (creator) => {
    if (!creator?.creatorId) {
      return "/creator-discovery";
    }

    return `/creator-profile-view/${creator.creatorId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

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
            to="/brand-dashboard"
            className="text-sm font-medium text-gray-600 hover:text-purple-600"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="mb-8">

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            ✨ AI Powered
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">
            AI Creator Matching
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl">
            Our AI analyzes campaign requirements,
            creator niche, followers, platform and
            audience relevance to recommend the best
            creator matches.
          </p>

        </div>

        {/* Campaign Selector */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-end gap-5">

            <div className="flex-1">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Campaign
              </label>

              {loadingCampaigns ? (
                <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-400">
                  Loading campaigns...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-3 text-sm">
                  No campaigns found. Create a campaign
                  first.
                </div>
              ) : (
                <select
                  value={selectedCampaignId}
                  onChange={(e) => {
                    setSelectedCampaignId(
                      e.target.value
                    );

                    setMatches([]);
                    setCampaign(null);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {campaigns.map(
                    (item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.title}
                      </option>
                    )
                  )}
                </select>
              )}

            </div>

            <button
              type="button"
              onClick={handleMatchCreators}
              disabled={
                loadingMatching ||
                !selectedCampaignId ||
                loadingCampaigns
              }
              className="px-7 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMatching
                ? "✨ AI Analyzing..."
                : "✨ Find Best Creators"}
            </button>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
            {error}
          </div>
        )}

        {/* Campaign Context */}

        {(campaign || selectedCampaign) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">

            <p className="text-sm text-gray-500">
              Matching for campaign
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">

              <div>

                <h2 className="text-2xl font-bold">
                  {campaign?.title ||
                    selectedCampaign?.title}
                </h2>

                <p className="text-gray-500 mt-1">
                  {campaign?.category ||
                    selectedCampaign?.category ||
                    "General"}{" "}
                  •{" "}
                  {campaign?.platform ||
                    selectedCampaign?.platform ||
                    "Instagram"}{" "}
                  • ₹
                  {Number(
                    campaign?.budget ||
                      selectedCampaign?.budget ||
                      0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

              <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold">
                Minimum{" "}
                {formatFollowers(
                  campaign?.minFollowers ||
                    selectedCampaign?.minFollowers ||
                    0
                )}{" "}
                followers
              </div>

            </div>

            {(campaign?.audience ||
              selectedCampaign?.audience) && (
              <div className="mt-5 bg-gray-50 rounded-xl p-4">

                <p className="text-xs text-gray-500">
                  Target Audience
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {campaign?.audience ||
                    selectedCampaign?.audience}
                </p>

              </div>
            )}

          </div>
        )}

        {/* Empty State */}

        {!loadingMatching &&
          matches.length === 0 &&
          !error && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

              <div className="text-5xl mb-4">
                🤖
              </div>

              <h2 className="text-xl font-bold">
                Ready to find your best creators?
              </h2>

              <p className="text-gray-500 mt-2">
                Select a campaign and let Gemini analyze
                your available creator profiles.
              </p>

            </div>
          )}

        {/* Loading */}

        {loadingMatching && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-4">
              ✨
            </div>

            <h2 className="text-xl font-bold">
              AI is analyzing creators...
            </h2>

            <p className="text-gray-500 mt-2">
              Comparing niche, followers, platform,
              audience relevance and campaign
              requirements.
            </p>

          </div>
        )}

        {/* Matches */}

        {!loadingMatching &&
          matches.length > 0 && (
            <div className="space-y-5">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    AI Recommended Creators
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Ranked by AI compatibility score
                  </p>
                </div>

                <span className="text-sm font-semibold text-purple-600">
                  {matches.length} creators analyzed
                </span>

              </div>

              {matches.map(
                (creator) => (
                  <div
                    key={creator.creatorId}
                    className="bg-white border border-gray-200 rounded-2xl p-6"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                      {/* Profile */}

                      <div className="flex items-center gap-4 flex-1">

                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl overflow-hidden">

                          {creator.profileImage ? (
                            <img
                              src={creator.profileImage}
                              alt={
                                creator.name ||
                                "Creator"
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "👤"
                          )}

                        </div>

                        <div>

                          <h3 className="text-xl font-bold">
                            {creator.name ||
                              "Creator"}
                          </h3>

                          <p className="text-gray-500">
                            {creator.username
                              ? `@${String(
                                  creator.username
                                ).replace(
                                  /^@/,
                                  ""
                                )}`
                              : "Username not added"}
                          </p>

                          <p className="text-sm text-purple-600 mt-1">
                            {creator.category ||
                              "General"}{" "}
                            •{" "}
                            {creator.location ||
                              "Location not specified"}
                          </p>

                        </div>

                      </div>

                      {/* Match Score */}

                      <div className="text-center">

                        <div
                          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
                            getMatchClasses(
                              Number(
                                creator.match
                              ) || 0
                            )
                          }`}
                        >
                          <div>

                            <p className="text-2xl font-bold">
                              {creator.match}%
                            </p>

                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          AI Match
                        </p>

                      </div>

                    </div>

                    {/* Stats */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                      <div className="bg-gray-50 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Instagram
                        </p>

                        <p className="font-bold mt-1">
                          {formatFollowers(
                            creator.followers
                          )}
                        </p>

                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          YouTube
                        </p>

                        <p className="font-bold mt-1">
                          {formatFollowers(
                            creator.youtubeSubscribers
                          )}
                        </p>

                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Creator Price
                        </p>

                        <p className="font-bold mt-1">
                          ₹
                          {Number(
                            creator.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">

                        <p className="text-xs text-gray-500">
                          Recommendation
                        </p>

                        <p className="font-bold text-green-600 mt-1">
                          {creator.recommendation ||
                            "Potential Fit"}
                        </p>

                      </div>

                    </div>

                    {/* Reasons */}

                    <div className="mt-6">

                      <h4 className="font-semibold">
                        Why AI recommends this creator
                      </h4>

                      {Array.isArray(
                        creator.reasons
                      ) &&
                      creator.reasons.length > 0 ? (
                        <ul className="mt-3 space-y-2">

                          {creator.reasons.map(
                            (
                              reason,
                              reasonIndex
                            ) => (
                              <li
                                key={
                                  reasonIndex
                                }
                                className="text-sm text-gray-600 flex gap-2"
                              >

                                <span className="text-green-600 font-bold">
                                  ✓
                                </span>

                                <span>
                                  {reason}
                                </span>

                              </li>
                            )
                          )}

                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 mt-3">
                          AI recommended this creator
                          based on the campaign
                          requirements.
                        </p>
                      )}

                    </div>

                    {/* Actions */}

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">

                      {/* DIRECT CREATOR PROFILE */}

                      <Link
                        to={getCreatorProfileLink(
                          creator
                        )}
                        className="px-5 py-3 bg-purple-600 text-white text-center rounded-xl font-semibold hover:bg-purple-700 transition"
                      >
                        View Creator
                      </Link>

                      {/* CREATOR DISCOVERY */}

                      <Link
                        to="/creator-discovery"
                        className="px-5 py-3 border border-gray-300 text-center rounded-xl font-semibold hover:border-purple-400 transition"
                      >
                        View More Creators
                      </Link>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </main>
    </div>
  );
}

export default AIMatching;