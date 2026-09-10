import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CampaignDetails() {
  const [campaign, setCampaign] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // --------------------------------
  // Get selected campaign
  // --------------------------------
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const selectedCampaign =
          JSON.parse(
            localStorage.getItem(
              "selectedCampaign"
            ) || "null"
          );

        if (!selectedCampaign) {
          setError(
            "Campaign not found."
          );
          setLoading(false);
          return;
        }

        // Demo campaign
        if (
          !selectedCampaign.mongoId &&
          !String(
            selectedCampaign.id || ""
          ).match(/^[a-f\d]{24}$/i)
        ) {
          setCampaign(
            selectedCampaign
          );
          setLoading(false);
          return;
        }

        const campaignId =
          selectedCampaign.mongoId ||
          selectedCampaign.id;

        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "Please login again."
          );
          setLoading(false);
          return;
        }

        const response =
          await fetch(
            `https://creator-bridge-backend.onrender.com/api/campaigns/${campaignId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load campaign"
          );
        }

        const mongoCampaign =
          data.campaign;

        const formattedCampaign = {
          id: mongoCampaign._id,

          mongoId:
            mongoCampaign._id,

          brand:
            mongoCampaign.brandId
              ?.companyName ||
            "Brand",

          title:
            mongoCampaign.title,

          category:
            mongoCampaign.category,

          budget: `₹${Number(
            mongoCampaign.budget || 0
          ).toLocaleString(
            "en-IN"
          )}`,

          minFollowers:
            mongoCampaign.minFollowers ||
            0,

          followers:
            mongoCampaign.minFollowers
              ? `${Number(
                  mongoCampaign.minFollowers
                ).toLocaleString(
                  "en-IN"
                )}+`
              : "Not specified",

          description:
            mongoCampaign.description,

          platform:
            mongoCampaign.platform ||
            "Instagram",

          deliverables:
            mongoCampaign.requirements ||
            "",

          audience:
            mongoCampaign.audience ||
            "General audience",

          status:
            mongoCampaign.status ===
            "active"
              ? "Active"
              : mongoCampaign.status,

          applications:
            mongoCampaign.applications ||
            0,

          createdAt:
            mongoCampaign.createdAt,
        };

        setCampaign(
          formattedCampaign
        );

        localStorage.setItem(
          "selectedCampaign",
          JSON.stringify(
            formattedCampaign
          )
        );
      } catch (err) {
        console.error(
          "Campaign details error:",
          err
        );

        setError(
          err.message ||
            "Failed to load campaign."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, []);

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">
            ⏳
          </div>

          <h2 className="text-xl font-bold">
            Loading campaign...
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching campaign details.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Error
  // --------------------------------
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-4xl mb-3">
            ⚠️
          </div>

          <h2 className="text-xl font-bold">
            Unable to load campaign
          </h2>

          <p className="text-gray-500 mt-2">
            {error ||
              "Campaign not found."}
          </p>

          <Link
            to="/campaigns"
            className="inline-block mt-5 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            ← Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const minimumFollowers =
    campaign.followers ||
    (campaign.minFollowers
      ? `${Number(
          String(
            campaign.minFollowers
          ).replace(/,/g, "")
        ).toLocaleString(
          "en-IN"
        )}+`
      : "Not specified");

  const creatorRequirements = [
    {
      label: "Category",
      value:
        campaign.category ||
        "Not specified",
    },
    {
      label: "Minimum Followers",
      value: minimumFollowers,
    },
    {
      label: "Platform",
      value:
        campaign.platform ||
        "Instagram",
    },
    {
      label: "Target Audience",
      value:
        campaign.audience ||
        "General audience",
    },
  ];

  const isActive =
    !campaign.status ||
    campaign.status === "Active" ||
    campaign.status === "active";

  const handleApplyClick = () => {
    localStorage.setItem(
      "selectedCampaign",
      JSON.stringify(campaign)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
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
            to="/campaigns"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
          >
            ← Back to Campaigns
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Campaign Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                🏢
              </div>

              <div>
                <p className="text-gray-500">
                  {campaign.brand ||
                    "Brand"}
                </p>

                <h1 className="text-2xl md:text-3xl font-bold mt-1">
                  {campaign.title ||
                    "Campaign"}
                </h1>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {campaign.category ||
                      "General"}
                  </span>

                  {campaign.status && (
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-center">
              <p className="text-xs">
                Campaign Budget
              </p>

              <p className="text-xl font-bold">
                {campaign.budget ||
                  "Negotiable"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold">
                About the Campaign
              </h2>

              <p className="text-gray-600 leading-7 mt-4">
                {campaign.description ||
                  "The brand is looking for talented creators to create engaging and authentic content for this campaign."}
              </p>
            </div>

            {/* Deliverables */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold">
                Deliverables
              </h2>

              <div className="mt-4">
                {campaign.deliverables ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 leading-7">
                      ✓{" "}
                      {campaign.deliverables}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      ✓ Create engaging campaign content
                    </p>

                    <p className="text-gray-600">
                      ✓ Mention and tag the brand
                    </p>

                    <p className="text-gray-600">
                      ✓ Follow campaign guidelines
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Creator Requirements */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold">
                Creator Requirements
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {creatorRequirements.map(
                  (item) => (
                    <div
                      key={item.label}
                      className="bg-gray-50 rounded-xl p-4"
                    >
                      <p className="text-xs text-gray-400">
                        {item.label}
                      </p>

                      <p className="font-semibold mt-1">
                        {item.value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Apply Card */}
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold">
                {isActive
                  ? "Interested?"
                  : "Campaign Closed"}
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                {isActive
                  ? "Apply to this campaign and connect privately with the brand."
                  : "This campaign is currently not accepting new applications."}
              </p>

              {isActive ? (
                <Link
                  to="/application"
                  onClick={
                    handleApplyClick
                  }
                  className="block w-full mt-6 bg-purple-600 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  Apply for Campaign →
                </Link>
              ) : (
                <div className="block w-full mt-6 bg-gray-200 text-gray-500 text-center py-3.5 rounded-xl font-semibold cursor-not-allowed">
                  Applications Closed
                </div>
              )}

              {/* Campaign Info */}
              <div className="border-t border-gray-100 mt-6 pt-5 space-y-3">
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">
                    Platform
                  </span>

                  <span className="font-semibold text-right">
                    {campaign.platform ||
                      "Instagram"}
                  </span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">
                    Applications
                  </span>

                  <span className="font-semibold">
                    {campaign.applications ||
                      0}
                  </span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span
                    className={`font-semibold ${
                      isActive
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {campaign.status ||
                      "Active"}
                  </span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">
                    Budget
                  </span>

                  <span className="font-semibold">
                    {campaign.budget ||
                      "Negotiable"}
                  </span>
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-purple-50 rounded-xl p-4 mt-6">
                <p className="text-xs text-purple-700 leading-5">
                  🔒 Your communication with the brand will remain private and campaign-specific.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to="/campaigns"
            className="flex-1 bg-white border border-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            ← Browse More Campaigns
          </Link>

          {isActive && (
            <Link
              to="/application"
              onClick={
                handleApplyClick
              }
              className="flex-1 bg-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Apply Now →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

export default CampaignDetails;