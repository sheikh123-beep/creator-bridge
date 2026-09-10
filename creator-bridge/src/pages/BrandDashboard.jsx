import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";

const defaultCampaigns = [
  {
    id: "glow-beauty",
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
    audience: "Beauty and skincare audience",
    status: "Active",
    creators: 12,
    applications: 12,
  },
  {
    id: "urban-threads",
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
    audience: "Fashion and lifestyle audience",
    status: "Active",
    creators: 8,
    applications: 8,
  },
  {
    id: "fitfuel",
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
    status: "Completed",
    creators: 5,
    applications: 5,
  },
];

function BrandDashboard() {
  const brandProfile =
    JSON.parse(localStorage.getItem("brandProfile")) || {};

  const brandName = brandProfile.companyName || "Brand";

  const [savedCampaigns] = useState(() => {
    return JSON.parse(localStorage.getItem("campaigns")) || [];
  });

  const campaigns = [...savedCampaigns, ...defaultCampaigns];

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "Active"
  ).length;

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setApplicationsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/applications/received",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data.applications || []);
      } catch (error) {
        console.error(
          "Fetch applications error:",
          error
        );
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleCampaignClick = (campaign) => {
    localStorage.setItem(
      "selectedCampaign",
      JSON.stringify(campaign)
    );
  };

  const handleApplicationStatus = async (
    applicationId,
    status
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update application"
        );
      }

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );

      alert(
        status === "accepted"
          ? "Application accepted successfully! 🎉"
          : "Application rejected."
      );
    } catch (error) {
      console.error(
        "Application status error:",
        error
      );

      alert(
        error.message ||
          "Failed to update application status."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/brand-dashboard"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              CB
            </div>

            <span className="text-xl font-bold text-gray-900">
              Creator Bridge
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/creator-discovery"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-purple-600"
            >
              Discover Creators
            </Link>

            <Link
              to="/brand-profile"
              className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold"
            >
              {brandName.charAt(0).toUpperCase()}
            </Link>

            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-sm text-purple-600 font-semibold mb-1">
              Brand Dashboard
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {brandName} 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your campaigns and connect with amazing creators.
            </p>
          </div>

          <Link
            to="/create-campaign"
            className="inline-flex items-center justify-center bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            + Create Campaign
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Active Campaigns
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {activeCampaigns}
                </h2>
              </div>

              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                📢
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Creators Hired
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  25
                </h2>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Creator Applications
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {applicationsLoading
                    ? "..."
                    : applications.length}
                </h2>
              </div>

              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Spend
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  ₹1.6L
                </h2>
              </div>

              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
          </div>
        </div>

        {/* AI Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-7 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✨</span>

                <span className="text-sm font-semibold uppercase tracking-wide">
                  AI Powered Matching
                </span>
              </div>

              <h2 className="text-2xl font-bold">
                Find the perfect creators for your campaign
              </h2>

              <p className="text-purple-100 mt-2 max-w-2xl">
                Our AI analyzes creator niche, audience, engagement
                and campaign requirements to recommend the best
                matches.
              </p>
            </div>

            <Link
              to="/ai-matching"
              className="bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition whitespace-nowrap"
            >
              Try AI Matching →
            </Link>
          </div>
        </div>

        {/* Campaigns */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Your Campaigns
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your active and previous campaigns.
            </p>
          </div>

          <Link
            to="/create-campaign"
            className="text-purple-600 text-sm font-semibold hover:text-purple-700"
          >
            + New Campaign
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {campaigns.slice(0, 6).map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase">
                    {campaign.category}
                  </p>

                  <h3 className="font-bold text-gray-900 mt-2">
                    {campaign.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {campaign.brand}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    campaign.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-400">Budget</p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {campaign.budget || "Negotiable"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-400">Creators</p>

                  <p className="font-semibold text-gray-900 mt-1">
                    {campaign.creators || 0}
                  </p>
                </div>
              </div>

              <Link
                to="/campaign-details"
                onClick={() =>
                  handleCampaignClick(campaign)
                }
                className="block text-center mt-5 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Manage Campaign →
              </Link>
            </div>
          ))}
        </div>

        {/* Creator Applications */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Creator Applications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Creators who recently applied to your campaigns.
            </p>
          </div>

          <Link
            to="/creator-discovery"
            className="text-purple-600 text-sm font-semibold hover:text-purple-700"
          >
            Discover Creators →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-10">
          {applicationsLoading ? (
            <div className="text-center py-12 px-5">
              <div className="text-4xl mb-3">⏳</div>

              <h3 className="font-semibold text-gray-900">
                Loading applications...
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Fetching creator applications from Creator Bridge.
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 px-5">
              <div className="text-4xl mb-3">👥</div>

              <h3 className="font-semibold text-gray-900">
                No creator applications yet
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                When creators apply to your campaigns, their
                applications will appear here.
              </p>

              <Link
                to="/creator-discovery"
                className="inline-block mt-5 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Find Creators →
              </Link>
            </div>
          ) : (
            applications.slice(0, 5).map((application) => {
              const creator = application.creatorId;
              const campaign = application.campaignId;
              const status =
                application.status || "pending";

              return (
                <div
                  key={application._id}
                  className="p-5 border-b border-gray-100 last:border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                      {(creator?.name || "C")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {creator?.name || "Creator"}
                      </h3>

                      {creator?.username && (
                        <p className="text-sm text-gray-500">
                          @{creator.username}
                        </p>
                      )}

                      <p className="text-sm text-gray-500 mt-1">
                        Applied for{" "}
                        <span className="font-medium text-gray-700">
                          {campaign?.title || "Campaign"}
                        </span>
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Applied{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </p>

                      {application.message && (
                        <p className="text-sm text-gray-600 mt-2 max-w-xl">
                          "{application.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        status === "accepted"
                          ? "bg-green-50 text-green-700"
                          : status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </span>

                    {status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleApplicationStatus(
                              application._id,
                              "accepted"
                            )
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleApplicationStatus(
                              application._id,
                              "rejected"
                            )
                          }
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <Link
                      to="/chat"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your brand activities quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/create-campaign"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-purple-200 transition"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              ➕
            </div>

            <h3 className="font-bold text-gray-900">
              Create Campaign
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Launch a new campaign and find creators.
            </p>
          </Link>

          <Link
            to="/creator-discovery"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-purple-200 transition"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              🔎
            </div>

            <h3 className="font-bold text-gray-900">
              Discover Creators
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Search and find creators for your campaigns.
            </p>
          </Link>

          <Link
            to="/ai-matching"
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-purple-200 transition"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl mb-4">
              ✨
            </div>

            <h3 className="font-bold text-gray-900">
              AI Creator Matching
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Let AI find the best creators for your campaign.
            </p>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-10 bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <div className="flex gap-3">
            <span className="text-xl">🔒</span>

            <div>
              <h3 className="font-semibold text-purple-900">
                Private Creator Communication
              </h3>

              <p className="text-sm text-purple-700 mt-1">
                Once you connect with a creator, your campaign-related
                conversation will remain private between the brand and
                creator. Secure authentication and database-based access
                control will be implemented in the backend.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BrandDashboard;