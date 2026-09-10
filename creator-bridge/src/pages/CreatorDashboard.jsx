import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "../components/LogoutButton";

const API_BASE_URL = "https://creator-bridge-backend.onrender.com";

function CreatorDashboard() {
  const creatorProfile =
    JSON.parse(localStorage.getItem("creatorProfile")) || {};

  const creatorName =
    creatorProfile.name || "Creator";

  // --------------------------------------------------
  // REAL PROFILE COMPLETION
  // --------------------------------------------------

  const profileCompletion = useMemo(() => {
    const fields = [
      creatorProfile.name,
      creatorProfile.username,
      creatorProfile.bio,
      creatorProfile.category,
      creatorProfile.instagram?.username,
      creatorProfile.instagram?.followers,
      creatorProfile.youtube?.channel,
      creatorProfile.youtube?.subscribers,
      creatorProfile.location,
      creatorProfile.price,
      creatorProfile.profileImage,
    ];

    const completedFields =
      fields.filter((value) => {
        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        if (typeof value === "number") {
          return value > 0;
        }

        return String(value).trim() !== "";
      }).length;

    return Math.round(
      (completedFields / fields.length) *
        100
    );
  }, [creatorProfile]);

  // --------------------------------------------------
  // DEMO CAMPAIGNS
  // --------------------------------------------------

  const defaultCampaigns = [
    {
      id: "demo-glow-beauty",
      brand: "Glow Beauty",
      title: "Summer Skincare Campaign",
      category: "Beauty",
      budget: "₹15,000",
      followers: "10K+",
      description:
        "Glow Beauty is launching a new summer skincare collection and is looking for creators who can introduce the products to an engaged audience through authentic and creative content.",
      platform: "Instagram",
      deliverables:
        "1 Instagram Reel + 2 Instagram Stories + Product review and demonstration",
      audience:
        "Beauty and skincare audience",
      status: "Active",
      match: 94,
      isDemo: true,
    },

    {
      id: "demo-urban-threads",
      brand: "Urban Threads",
      title: "New Summer Collection",
      category: "Fashion",
      budget: "₹20,000",
      followers: "25K+",
      description:
        "Urban Threads is launching its new summer fashion collection and wants creators to showcase the latest styles through engaging social media content.",
      platform: "Instagram",
      deliverables:
        "1 Instagram Reel + 2 Stories + Outfit styling content",
      audience:
        "Fashion and lifestyle audience",
      status: "Active",
      match: 89,
      isDemo: true,
    },

    {
      id: "demo-fitfuel",
      brand: "FitFuel",
      title: "Healthy Lifestyle Campaign",
      category: "Fitness",
      budget: "₹12,000",
      followers: "15K+",
      description:
        "FitFuel is looking for fitness and wellness creators to promote healthy lifestyle products through authentic and informative content.",
      platform: "Instagram",
      deliverables:
        "1 Instagram Reel + 2 Stories + Product mention",
      audience:
        "Fitness, wellness and healthy lifestyle audience",
      status: "Active",
      match: 84,
      isDemo: true,
    },
  ];

  const [applications, setApplications] =
    useState([]);

  const [campaigns, setCampaigns] =
    useState(defaultCampaigns);

  const [
    loadingApplications,
    setLoadingApplications,
  ] = useState(true);

  const [
    loadingCampaigns,
    setLoadingCampaigns,
  ] = useState(true);

  const [error, setError] =
    useState("");

  const token =
    localStorage.getItem("token");

  // --------------------------------------------------
  // FETCH REAL APPLICATIONS
  // --------------------------------------------------

  useEffect(() => {
    const fetchApplications =
      async () => {
        if (!token) {
          setLoadingApplications(false);
          return;
        }

        try {
          setLoadingApplications(true);

          const response =
            await fetch(
              `${API_BASE_URL}/api/applications/my`,
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
                "Failed to fetch applications"
            );
          }

          const realApplications =
            (
              data.applications || []
            ).map(
              (application) => ({
                id:
                  application._id,

                campaignId:
                  application
                    .campaignId?._id ||
                  application.campaignId,

                campaignTitle:
                  application
                    .campaignId?.title ||
                  "Campaign",

                brand:
                  application
                    .brandId?.companyName ||
                  "Brand",

                category:
                  application
                    .campaignId?.category ||
                  "General",

                budget:
                  application
                    .campaignId
                    ?.budget !==
                  undefined
                    ? `₹${Number(
                        application
                          .campaignId
                          .budget
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    : "Negotiable",

                platform:
                  application
                    .campaignId
                    ?.platform ||
                  "Instagram",

                message:
                  application.message ||
                  "",

                status:
                  application.status ===
                  "accepted"
                    ? "Accepted"
                    : application.status ===
                      "rejected"
                    ? "Rejected"
                    : "Pending",

                appliedAt:
                  application.createdAt ||
                  new Date().toISOString(),
              })
            );

          setApplications(
            realApplications
          );

          localStorage.setItem(
            "applications",
            JSON.stringify(
              realApplications
            )
          );
        } catch (err) {
          console.error(
            "Creator applications error:",
            err
          );

          setError(
            err.message ||
              "Unable to load your applications."
          );
        } finally {
          setLoadingApplications(
            false
          );
        }
      };

    fetchApplications();
  }, [token]);

  // --------------------------------------------------
  // FETCH REAL CAMPAIGNS
  // --------------------------------------------------

  useEffect(() => {
    const fetchCampaigns =
      async () => {
        if (!token) {
          setLoadingCampaigns(false);
          return;
        }

        try {
          setLoadingCampaigns(true);

          const response =
            await fetch(
              `${API_BASE_URL}/api/campaigns`,
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
                "Failed to fetch campaigns"
            );
          }

          const realCampaigns =
            (
              data.campaigns || []
            ).map(
              (campaign) => ({
                id:
                  campaign._id,

                mongoId:
                  campaign._id,

                brand:
                  campaign
                    .brandId
                    ?.companyName ||
                  "Brand",

                title:
                  campaign.title ||
                  "Campaign",

                category:
                  campaign.category ||
                  "General",

                budget:
                  campaign.budget !==
                  undefined
                    ? `₹${Number(
                        campaign.budget
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    : "Negotiable",

                followers:
                  campaign
                    .minFollowers
                    ? `${Number(
                        campaign
                          .minFollowers
                      ).toLocaleString(
                        "en-IN"
                      )}+`
                    : "Any",

                description:
                  campaign.description ||
                  "",

                platform:
                  campaign.platform ||
                  "Instagram",

                deliverables:
                  campaign.requirements ||
                  "",

                audience:
                  campaign.audience ||
                  "General audience",

                status:
                  campaign.status ===
                  "active"
                    ? "Active"
                    : campaign.status,

                match: 90,

                isDemo: false,
              })
            );

          setCampaigns([
            ...realCampaigns,
            ...defaultCampaigns,
          ]);
        } catch (err) {
          console.error(
            "Creator campaigns error:",
            err
          );

          setCampaigns(
            defaultCampaigns
          );

          setError(
            err.message ||
              "Unable to load latest campaigns."
          );
        } finally {
          setLoadingCampaigns(
            false
          );
        }
      };

    fetchCampaigns();
  }, [token]);

  // --------------------------------------------------
  // REAL ACTIVE CAMPAIGN COUNT
  // DEMO CAMPAIGNS EXCLUDED
  // --------------------------------------------------

  const activeCampaigns =
    useMemo(() => {
      return campaigns.filter(
        (campaign) =>
          !campaign.isDemo &&
          String(
            campaign.status
          ).toLowerCase() ===
            "active"
      ).length;
    }, [campaigns]);

  // --------------------------------------------------
  // SIMULATED STATS FOR MVP
  // --------------------------------------------------

  const profileViews = 128;

  const totalEarnings = 47000;

  // --------------------------------------------------
  // CAMPAIGN CLICK
  // --------------------------------------------------

  const handleCampaignClick =
    (campaign) => {
      localStorage.setItem(
        "selectedCampaign",
        JSON.stringify(campaign)
      );
    };

  // --------------------------------------------------
  // STATUS UI
  // --------------------------------------------------

  const getStatusClasses =
    (status) => {
      if (status === "Accepted") {
        return "bg-green-50 text-green-700";
      }

      if (status === "Rejected") {
        return "bg-red-50 text-red-700";
      }

      return "bg-yellow-50 text-yellow-700";
    };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            Creator
            <span className="text-purple-600">
              Bridge
            </span>
          </Link>

          <div className="flex items-center gap-4">

            <button
              type="button"
              className="relative text-xl"
            >
              🔔

              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <Link
              to="/creator-profile"
              className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition"
            >
              👤
            </Link>

            <LogoutButton />

          </div>

        </div>

      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Welcome */}

        <div className="mb-8">

          <p className="text-purple-600 text-sm font-semibold">
            CREATOR DASHBOARD
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Welcome back, {creatorName} 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Discover campaigns and grow your creator
            career.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* Profile Views */}

          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <p className="text-gray-500 text-sm">
              Profile Views
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {profileViews}
            </h2>

            <p className="text-green-600 text-xs mt-2">
              +18% this month
            </p>

          </div>

          {/* Applications */}

          <Link
            to="/application"
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
          >

            <p className="text-gray-500 text-sm">
              Applications
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loadingApplications
                ? "..."
                : applications.length}
            </h2>

            <p className="text-purple-600 text-xs mt-2">
              View applications →
            </p>

          </Link>

          {/* Active Campaigns */}

          <Link
            to="/campaigns"
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
          >

            <p className="text-gray-500 text-sm">
              Active Campaigns
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {loadingCampaigns
                ? "..."
                : activeCampaigns}
            </h2>

            <p className="text-purple-600 text-xs mt-2">
              Browse campaigns →
            </p>

          </Link>

          {/* Earnings */}

          <Link
            to="/earnings"
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
          >

            <p className="text-gray-500 text-sm">
              Total Earnings
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹
              {totalEarnings.toLocaleString(
                "en-IN"
              )}
            </h2>

            <p className="text-green-600 text-xs mt-2">
              View earnings →
            </p>

          </Link>

        </div>

        {/* AI Banner */}

        <div className="bg-purple-600 text-white rounded-2xl p-6 md:p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="text-sm font-semibold text-purple-200">
                ✨ AI POWERED
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mt-2">
                Find campaigns made for you
              </h2>

              <p className="text-purple-100 mt-2 max-w-2xl">
                Our AI analyzes your niche, audience and
                social reach to find campaigns that match
                your creator profile.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs">
                  🎯 Niche Match
                </span>

                <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs">
                  📊 Audience Fit
                </span>

                <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs">
                  ✨ AI Score
                </span>

              </div>

            </div>

            <Link
              to="/campaigns"
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition whitespace-nowrap text-center"
            >
              Find My Matches →
            </Link>

          </div>

        </div>

        {/* Recommended Campaigns */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <div>

            <h2 className="text-2xl font-bold">
              Recommended Campaigns
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Campaigns available on Creator Bridge
            </p>

          </div>

          <Link
            to="/campaigns"
            className="text-purple-600 text-sm font-semibold hover:text-purple-700"
          >
            View all →
          </Link>

        </div>

        {/* Campaign Cards */}

        {loadingCampaigns ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

            <div className="text-3xl mb-3">
              ⏳
            </div>

            <p className="text-gray-500">
              Loading campaigns...
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {campaigns
              .slice(0, 6)
              .map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex justify-between items-start gap-3">

                    <div>

                      <p className="text-xs text-purple-600 font-semibold">
                        {campaign.brand}
                      </p>

                      <h3 className="font-bold text-lg mt-1">
                        {campaign.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {campaign.category}
                      </p>

                    </div>

                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {campaign.match}% Match
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-xs text-gray-400">
                        Budget
                      </p>

                      <p className="font-bold mt-1">
                        {campaign.budget}
                      </p>

                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-xs text-gray-400">
                        Followers
                      </p>

                      <p className="font-bold mt-1">
                        {campaign.followers}
                      </p>

                    </div>

                  </div>

                  <Link
                    to="/campaign-details"
                    onClick={() =>
                      handleCampaignClick(
                        campaign
                      )
                    }
                    className="block text-center mt-5 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
                  >
                    View Campaign →
                  </Link>

                </div>
              ))}

          </div>
        )}

        {/* Recent Applications */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10 mb-5">

          <div>

            <h2 className="text-2xl font-bold">
              Recent Applications
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Track your latest campaign applications
            </p>

          </div>

          <Link
            to="/application"
            className="text-purple-600 text-sm font-semibold hover:text-purple-700"
          >
            View all →
          </Link>

        </div>

        {/* Applications */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {loadingApplications ? (

            <div className="text-center py-12 px-5">

              <div className="text-4xl mb-3">
                ⏳
              </div>

              <h3 className="font-semibold text-gray-900">
                Loading applications...
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Fetching your latest applications.
              </p>

            </div>

          ) : applications.length === 0 ? (

            <div className="text-center py-12 px-5">

              <div className="text-4xl mb-3">
                📋
              </div>

              <h3 className="font-semibold text-gray-900">
                No applications yet
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Apply to campaigns and your applications will
                appear here.
              </p>

              <Link
                to="/campaigns"
                className="inline-block mt-5 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Browse Campaigns →
              </Link>

            </div>

          ) : (

            applications
              .slice(0, 5)
              .map(
                (application) => (
                  <div
                    key={application.id}
                    className="p-5 border-b border-gray-100 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >

                    <div>

                      <p className="font-semibold text-gray-900">
                        {application.campaignTitle}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {application.brand}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-2">

                        <p className="text-xs text-gray-400">
                          Applied{" "}
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </p>

                        {application.budget && (
                          <p className="text-xs text-gray-400">
                            Budget:{" "}
                            {application.budget}
                          </p>
                        )}

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                      <Link
                        to="/chat"
                        onClick={() => {
                          localStorage.setItem(
                            "currentChat",
                            JSON.stringify({
                              applicationId:
                                application.id,

                              campaignId:
                                application.campaignId,

                              campaignTitle:
                                application.campaignTitle,

                              brand:
                                application.brand,

                              creatorName:
                                creatorName,
                            })
                          );
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                      >
                        Chat
                      </Link>

                    </div>

                  </div>
                )
              )

          )}

        </div>

        {/* Profile Completion */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h3 className="font-bold text-lg">
                Complete your creator profile
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                A complete profile increases your chances of
                getting selected by brands.
              </p>

            </div>

            <Link
              to="/creator-profile"
              className="bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition text-center"
            >
              {profileCompletion === 100
                ? "Edit Profile →"
                : "Complete Profile →"}
            </Link>

          </div>

          <div className="mt-5">

            <div className="flex justify-between text-sm mb-2">

              <span className="text-gray-500">
                Profile completion
              </span>

              <span className="font-semibold">
                {profileCompletion}%
              </span>

            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="grid md:grid-cols-3 gap-5 mt-8">

          <Link
            to="/campaigns"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
          >

            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
              🔎
            </div>

            <h3 className="font-bold mt-4">
              Browse Campaigns
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Find new collaboration opportunities.
            </p>

            <p className="text-purple-600 text-sm font-semibold mt-4">
              Explore Campaigns →
            </p>

          </Link>

          <Link
            to="/earnings"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
          >

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
              💰
            </div>

            <h3 className="font-bold mt-4">
              Earnings
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Track your campaign earnings and payments.
            </p>

            <p className="text-purple-600 text-sm font-semibold mt-4">
              View Earnings →
            </p>

          </Link>

          <Link
            to="/chat"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
          >

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
              💬
            </div>

            <h3 className="font-bold mt-4">
              Messages
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Chat privately with brands about campaigns.
            </p>

            <p className="text-purple-600 text-sm font-semibold mt-4">
              Open Messages →
            </p>

          </Link>

        </div>

      </main>
    </div>
  );
}

export default CreatorDashboard;