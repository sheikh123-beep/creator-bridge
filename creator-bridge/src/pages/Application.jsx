import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function Application() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const creatorProfile =
    JSON.parse(
      localStorage.getItem("creatorProfile")
    ) || {};

  const savedCampaign =
    JSON.parse(
      localStorage.getItem("selectedCampaign")
    ) || null;

  // --------------------------------------------------
  // PAGE MODE
  // --------------------------------------------------

  const isMyApplicationsPage =
    location.pathname === "/my-applications";

  // --------------------------------------------------
  // STATES
  // --------------------------------------------------

  const [applications, setApplications] =
    useState([]);

  const [loadingApplications, setLoadingApplications] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // FETCH MY REAL APPLICATIONS
  // --------------------------------------------------

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setLoadingApplications(false);
        return;
      }

      try {
        setLoadingApplications(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/applications/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch applications"
          );
        }

        const realApplications = (
          data.applications || []
        ).map((application) => {
          const campaign =
            application.campaignId || {};

          const brand =
            application.brandId || {};

          return {
            id: application._id,

            mongoId: application._id,

            campaignId:
              campaign._id ||
              application.campaignId,

            campaignTitle:
              campaign.title ||
              "Campaign",

            brand:
              brand.companyName ||
              "Brand",

            category:
              campaign.category ||
              "General",

            budget:
              campaign.budget !== undefined
                ? `₹${Number(
                    campaign.budget
                  ).toLocaleString("en-IN")}`
                : "Negotiable",

            platform:
              campaign.platform ||
              "Instagram",

            description:
              campaign.description ||
              "",

            requirements:
              campaign.requirements ||
              "",

            audience:
              campaign.audience ||
              "",

            minFollowers:
              campaign.minFollowers || 0,

            message:
              application.message || "",

            status:
              application.status === "accepted"
                ? "Accepted"
                : application.status === "rejected"
                ? "Rejected"
                : "Pending",

            rawStatus:
              application.status ||
              "pending",

            appliedAt:
              application.createdAt ||
              new Date().toISOString(),
          };
        });

        setApplications(realApplications);

        localStorage.setItem(
          "applications",
          JSON.stringify(realApplications)
        );
      } catch (err) {
        console.error(
          "Applications fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your applications."
        );
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [token]);

  // --------------------------------------------------
  // STATUS CLASSES
  // --------------------------------------------------

  const getStatusClasses = (status) => {
    if (status === "Accepted") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  // --------------------------------------------------
  // OPEN CHAT
  // --------------------------------------------------

  const openChat = (application) => {
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
          creatorProfile.name ||
          "Creator",
      })
    );
  };

  // --------------------------------------------------
  // VIEW CAMPAIGN
  // --------------------------------------------------

  const viewCampaign = (application) => {
    localStorage.setItem(
      "selectedCampaign",
      JSON.stringify({
        id: application.campaignId,

        mongoId:
          application.campaignId,

        title:
          application.campaignTitle,

        brand:
          application.brand,

        category:
          application.category,

        budget:
          application.budget,

        platform:
          application.platform,

        description:
          application.description,

        requirements:
          application.requirements,

        audience:
          application.audience,

        minFollowers:
          application.minFollowers,
      })
    );

    navigate("/campaign-details");
  };

  // --------------------------------------------------
  // HANDLE APPLICATION SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert(
        "Please write a short message before applying."
      );
      return;
    }

    if (!token) {
      alert(
        "Please login again to apply."
      );

      navigate("/login");
      return;
    }

    if (!savedCampaign) {
      alert(
        "Please select a campaign before applying."
      );

      navigate("/campaigns");
      return;
    }

    const campaignId =
      savedCampaign.mongoId ||
      savedCampaign.id;

    // --------------------------------------------------
    // MONGODB OBJECT ID VALIDATION
    // --------------------------------------------------

    if (
      !/^[0-9a-fA-F]{24}$/.test(
        String(campaignId)
      )
    ) {
      alert(
        "This is a demo campaign. Please select a campaign created by a brand before applying."
      );

      return;
    }

    // --------------------------------------------------
    // CLIENT-SIDE DUPLICATE CHECK
    // --------------------------------------------------

    const alreadyApplied =
      applications.some(
        (application) =>
          String(
            application.campaignId
          ) === String(campaignId)
      );

    if (alreadyApplied) {
      alert(
        "You have already applied to this campaign. You can check its status in My Applications."
      );

      navigate("/my-applications");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            campaignId,
            message:
              message.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit application"
        );
      }

      const application =
        data.application;

      const applicationId =
        application?._id || "";

      if (!applicationId) {
        throw new Error(
          "Application was created but application ID was not returned."
        );
      }

      const newApplication = {
        id: applicationId,

        mongoId: applicationId,

        campaignId:
          application?.campaignId?._id ||
          campaignId,

        campaignTitle:
          application?.campaignId?.title ||
          savedCampaign.title ||
          "Campaign",

        brand:
          application?.brandId?.companyName ||
          savedCampaign.brand ||
          "Brand",

        category:
          application?.campaignId?.category ||
          savedCampaign.category ||
          "General",

        budget:
          application?.campaignId?.budget !==
          undefined
            ? `₹${Number(
                application.campaignId.budget
              ).toLocaleString("en-IN")}`
            : savedCampaign.budget ||
              "Negotiable",

        platform:
          application?.campaignId?.platform ||
          savedCampaign.platform ||
          "Instagram",

        description:
          application?.campaignId?.description ||
          savedCampaign.description ||
          "",

        requirements:
          application?.campaignId?.requirements ||
          savedCampaign.requirements ||
          "",

        audience:
          application?.campaignId?.audience ||
          savedCampaign.audience ||
          "",

        minFollowers:
          application?.campaignId?.minFollowers ||
          savedCampaign.minFollowers ||
          0,

        creatorName:
          application?.creatorId?.name ||
          creatorProfile.name ||
          "Creator",

        creatorUsername:
          application?.creatorId?.username ||
          creatorProfile.username ||
          "",

        message:
          message.trim(),

        status:
          application?.status ===
          "accepted"
            ? "Accepted"
            : application?.status ===
              "rejected"
            ? "Rejected"
            : "Pending",

        rawStatus:
          application?.status ||
          "pending",

        appliedAt:
          application?.createdAt ||
          new Date().toISOString(),
      };

      // --------------------------------------------------
      // UPDATE LOCAL APPLICATION LIST
      // --------------------------------------------------

      const updatedApplications = [
        newApplication,

        ...applications.filter(
          (existingApplication) =>
            String(
              existingApplication.campaignId
            ) !==
            String(
              newApplication.campaignId
            )
        ),
      ];

      setApplications(
        updatedApplications
      );

      localStorage.setItem(
        "applications",
        JSON.stringify(
          updatedApplications
        )
      );

      // --------------------------------------------------
      // SAVE CURRENT APPLICATION
      // --------------------------------------------------

      localStorage.setItem(
        "currentApplication",
        JSON.stringify({
          id: applicationId,

          mongoId: applicationId,

          campaignId:
            application?.campaignId?._id ||
            campaignId,

          campaignTitle:
            application?.campaignId?.title ||
            savedCampaign.title ||
            "Campaign",

          brand:
            application?.brandId?.companyName ||
            savedCampaign.brand ||
            "Brand",

          creatorName:
            application?.creatorId?.name ||
            creatorProfile.name ||
            "Creator",

          creatorUsername:
            application?.creatorId?.username ||
            creatorProfile.username ||
            "",

          message:
            message.trim(),

          status:
            application?.status ||
            "pending",

          createdAt:
            application?.createdAt ||
            new Date().toISOString(),
        })
      );

      // --------------------------------------------------
      // SAVE CHAT CONTEXT
      // --------------------------------------------------

      localStorage.setItem(
        "currentChat",
        JSON.stringify({
          applicationId,

          campaignId:
            application?.campaignId?._id ||
            campaignId,

          campaignTitle:
            application?.campaignId?.title ||
            savedCampaign.title ||
            "Campaign",

          brand:
            application?.brandId?.companyName ||
            savedCampaign.brand ||
            "Brand",

          creatorName:
            application?.creatorId?.name ||
            creatorProfile.name ||
            "Creator",
        })
      );

      alert(
        "Application submitted successfully! 🎉"
      );

      navigate("/chat");
    } catch (err) {
      console.error(
        "Application submit error:",
        err
      );

      // --------------------------------------------------
      // DUPLICATE APPLICATION ERROR
      // --------------------------------------------------

      if (
        err.message
          ?.toLowerCase()
          .includes("duplicate")
      ) {
        alert(
          "You have already applied to this campaign."
        );

        navigate("/my-applications");
        return;
      }

      alert(
        err.message ||
          "Something went wrong while submitting your application."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // MY APPLICATIONS PAGE
  // ==================================================

  if (isMyApplicationsPage) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* Navbar */}

        <nav className="bg-white border-b border-gray-200">

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

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
              to="/creator-dashboard"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              ← Dashboard
            </Link>

          </div>

        </nav>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}

          <div className="mb-8">

            <p className="text-purple-600 text-sm font-semibold">
              CREATOR
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              My Applications
            </h1>

            <p className="text-gray-500 mt-2">
              Track all your campaign applications
              and their current status.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Stats */}

          {!loadingApplications &&
            applications.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {applications.length}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <p className="text-3xl font-bold mt-2 text-yellow-600">
                    {
                      applications.filter(
                        (application) =>
                          application.status ===
                          "Pending"
                      ).length
                    }
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Accepted
                  </p>

                  <p className="text-3xl font-bold mt-2 text-green-600">
                    {
                      applications.filter(
                        (application) =>
                          application.status ===
                          "Accepted"
                      ).length
                    }
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">
                    Rejected
                  </p>

                  <p className="text-3xl font-bold mt-2 text-red-600">
                    {
                      applications.filter(
                        (application) =>
                          application.status ===
                          "Rejected"
                      ).length
                    }
                  </p>
                </div>

              </div>
            )}

          {/* Loading */}

          {loadingApplications ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

              <div className="text-4xl mb-3">
                ⏳
              </div>

              <h2 className="font-semibold text-gray-900">
                Loading your applications...
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Fetching the latest data from Creator Bridge.
              </p>

            </div>
          ) : applications.length === 0 ? (

            /* Empty */

            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

              <div className="text-5xl mb-4">
                📋
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                No applications yet
              </h2>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                You haven't applied to any campaigns yet.
                Explore available campaigns and find
                your next collaboration.
              </p>

              <Link
                to="/campaigns"
                className="inline-block mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Browse Campaigns →
              </Link>

            </div>

          ) : (

            /* Application List */

            <div className="space-y-4">

              {applications.map(
                (application) => (
                  <div
                    key={application.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 hover:shadow-md transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* Main */}

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                            {application.category}
                          </span>

                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>

                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mt-3">
                          {application.campaignTitle}
                        </h2>

                        <p className="text-gray-500 mt-1">
                          {application.brand}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400">
                              Budget
                            </p>

                            <p className="font-semibold text-sm mt-1">
                              {application.budget}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400">
                              Platform
                            </p>

                            <p className="font-semibold text-sm mt-1">
                              {application.platform}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400">
                              Applied
                            </p>

                            <p className="font-semibold text-sm mt-1">
                              {new Date(
                                application.appliedAt
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-xs text-gray-400">
                              Application ID
                            </p>

                            <p className="font-semibold text-sm mt-1 truncate">
                              #
                              {String(
                                application.id
                              ).slice(-6)}
                            </p>
                          </div>

                        </div>

                        {application.message && (
                          <div className="mt-5 border-t border-gray-100 pt-4">

                            <p className="text-xs text-gray-400">
                              Your message
                            </p>

                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {application.message}
                            </p>

                          </div>
                        )}

                      </div>

                      {/* Actions */}

                      <div className="flex lg:flex-col gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            viewCampaign(
                              application
                            )
                          }
                          className="flex-1 lg:flex-none text-center border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition whitespace-nowrap"
                        >
                          View Campaign
                        </button>

                        <Link
                          to="/chat"
                          onClick={() =>
                            openChat(
                              application
                            )
                          }
                          className="flex-1 lg:flex-none text-center bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
                        >
                          💬 Chat
                        </Link>

                      </div>

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

  // ==================================================
  // APPLY TO CAMPAIGN PAGE
  // ==================================================

  if (!savedCampaign) {
    return (
      <div className="min-h-screen bg-gray-50">

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
              className="text-sm font-semibold text-purple-600"
            >
              ← Browse Campaigns
            </Link>

          </div>

        </nav>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📢
            </div>

            <h1 className="text-2xl font-bold">
              Select a Campaign First
            </h1>

            <p className="text-gray-500 mt-2">
              Choose a campaign from the campaign
              list before submitting an application.
            </p>

            <Link
              to="/campaigns"
              className="inline-block mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Browse Campaigns →
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ==================================================
  // APPLY FORM
  // ==================================================

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
            to="/campaign-details"
            className="text-sm font-semibold text-purple-600"
          >
            ← Back to Campaign
          </Link>

        </div>

      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}

        <div className="mb-8">

          <p className="text-purple-600 text-sm font-semibold">
            APPLICATION
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Apply for this campaign
          </h1>

          <p className="text-gray-500 mt-2">
            Introduce yourself and tell the brand
            why you're a great fit.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* FORM */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8"
            >

              <h2 className="text-xl font-bold">
                Your Application
              </h2>

              {/* Creator */}

              <div className="bg-gray-50 rounded-xl p-4 mt-5">

                <p className="text-xs text-gray-400">
                  Applying as
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {creatorProfile.name ||
                    "Creator"}
                </p>

                {creatorProfile.username && (
                  <p className="text-sm text-gray-500 mt-1">
                    @{creatorProfile.username}
                  </p>
                )}

              </div>

              {/* Message */}

              <div className="mt-6">

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message to Brand
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  rows="7"
                  placeholder="Tell the brand about yourself, your audience, content style, and why you would be a great fit for this campaign..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Keep your message professional and
                  relevant to the campaign.
                </p>

              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <Link
                  to="/campaign-details"
                  className="flex-1 text-center border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white py-3.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit Application →"}
                </button>

              </div>

            </form>

          </div>

          {/* CAMPAIGN SUMMARY */}

          <div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">

              <p className="text-xs text-purple-600 font-semibold uppercase">
                Campaign
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-2">
                {savedCampaign.title ||
                  "Campaign"}
              </h2>

              <p className="text-gray-500 mt-1">
                {savedCampaign.brand ||
                  "Brand"}
              </p>

              <div className="space-y-4 mt-6">

                <div>
                  <p className="text-xs text-gray-400">
                    Category
                  </p>

                  <p className="font-semibold mt-1">
                    {savedCampaign.category ||
                      "General"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Budget
                  </p>

                  <p className="font-semibold mt-1">
                    {savedCampaign.budget ||
                      "Negotiable"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Platform
                  </p>

                  <p className="font-semibold mt-1">
                    {savedCampaign.platform ||
                      "Instagram"}
                  </p>
                </div>

                {savedCampaign.minFollowers && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Minimum Followers
                    </p>

                    <p className="font-semibold mt-1">
                      {Number(
                        savedCampaign.minFollowers
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                )}

              </div>

              <div className="border-t border-gray-100 mt-6 pt-5">

                <div className="bg-purple-50 rounded-xl p-4">

                  <p className="text-sm font-semibold text-purple-900">
                    🔒 Private Communication
                  </p>

                  <p className="text-xs text-purple-700 leading-5 mt-1">
                    After applying, you can communicate
                    privately with the brand through
                    Creator Bridge.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Application;