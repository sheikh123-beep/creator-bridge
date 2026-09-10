import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    platform: "Instagram",
    budget: "",
    minFollowers: "",
    deliverables: "",
    audience: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // AI CAMPAIGN GENERATOR
  // ==========================================
  const handleGenerateAI = async () => {
    if (!form.description.trim()) {
      alert(
        "Please enter your campaign brief/description first."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setAiLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/ai/generate-campaign",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            brief: form.description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate campaign with AI"
        );
      }

      // ==========================================
      // SUPPORT BOTH RESPONSE FORMATS
      // ==========================================
      // Backend may return:
      // { campaign: {...} }
      //
      // OR:
      // { title: "...", description: "...", ... }
      //
      // This handles both safely.
      const aiCampaign =
        data.campaign || data;

      if (
        !aiCampaign ||
        typeof aiCampaign !== "object" ||
        !aiCampaign.title
      ) {
        console.error(
          "Unexpected AI response:",
          data
        );

        throw new Error(
          "AI did not return campaign data"
        );
      }

      // ==========================================
      // FILL FORM WITH AI GENERATED DATA
      // ==========================================
      setForm((prev) => ({
        ...prev,

        title:
          aiCampaign.title ||
          prev.title,

        description:
          aiCampaign.description ||
          prev.description,

        category:
          aiCampaign.category ||
          prev.category,

        platform:
          aiCampaign.platform ||
          prev.platform,

        budget:
          aiCampaign.budget !== undefined
            ? String(aiCampaign.budget)
            : prev.budget,

        minFollowers:
          aiCampaign.minFollowers !== undefined
            ? String(aiCampaign.minFollowers)
            : prev.minFollowers,

        deliverables:
          Array.isArray(
            aiCampaign.deliverables
          )
            ? aiCampaign.deliverables.join(
                " + "
              )
            : aiCampaign.deliverables ||
              prev.deliverables,

        audience:
          aiCampaign.audience ||
          prev.audience,
      }));

      alert(
        "Campaign generated successfully with AI 🤖✨"
      );
    } catch (error) {
      console.error(
        "AI campaign generation error:",
        error
      );

      alert(
        error.message ||
          "Failed to generate campaign with AI"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // PUBLISH CAMPAIGN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter campaign title.");
      return;
    }

    if (!form.description.trim()) {
      alert(
        "Please enter campaign description."
      );
      return;
    }

    if (!form.category.trim()) {
      alert(
        "Please enter campaign category."
      );
      return;
    }

    if (!form.budget) {
      alert(
        "Please enter campaign budget."
      );
      return;
    }

    if (!form.deliverables.trim()) {
      alert(
        "Please enter campaign deliverables."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/campaigns",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: form.title.trim(),

            description:
              form.description.trim(),

            category:
              form.category.trim(),

            platform:
              form.platform,

            budget:
              Number(form.budget),

            minFollowers:
              Number(form.minFollowers) || 0,

            requirements:
              form.deliverables.trim(),

            audience:
              form.audience.trim(),

            status: "active",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create campaign"
        );
      }

      // ==========================================
      // BACKEND CAMPAIGN
      // ==========================================
      const savedCampaign =
        data.campaign;

      if (!savedCampaign) {
        throw new Error(
          "Campaign was not returned by backend"
        );
      }

      // ==========================================
      // LOCAL STORAGE COMPATIBILITY BACKUP
      // ==========================================
      const localCampaign = {
        id: savedCampaign._id,

        mongoId: savedCampaign._id,

        title:
          savedCampaign.title ||
          form.title,

        description:
          savedCampaign.description ||
          form.description,

        category:
          savedCampaign.category ||
          form.category,

        platform:
          savedCampaign.platform ||
          form.platform,

        budget: `₹${Number(
          savedCampaign.budget ||
            form.budget
        ).toLocaleString("en-IN")}`,

        followers:
          savedCampaign.minFollowers ||
          Number(form.minFollowers) ||
          0,

        deliverables:
          savedCampaign.requirements ||
          form.deliverables,

        audience:
          savedCampaign.audience ||
          form.audience,

        status:
          savedCampaign.status ||
          "Active",

        brand:
          savedCampaign.brandId
            ?.companyName ||
          "Your Brand",
      };

      localStorage.setItem(
        "selectedCampaign",
        JSON.stringify(localCampaign)
      );

      // ==========================================
      // EXISTING CAMPAIGN LIST COMPATIBILITY
      // ==========================================
      const existingCampaigns =
        JSON.parse(
          localStorage.getItem(
            "campaigns"
          ) || "[]"
        );

      localStorage.setItem(
        "campaigns",
        JSON.stringify([
          localCampaign,
          ...existingCampaigns,
        ])
      );

      alert(
        "Campaign created successfully 🎉"
      );

      navigate("/campaigns");
    } catch (error) {
      console.error(
        "Campaign creation error:",
        error
      );

      alert(
        error.message ||
          "Failed to create campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/brand-dashboard"
              )
            }
            className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Campaign
          </h1>

          <p className="mt-2 text-gray-500">
            Create a campaign and find the
            perfect creators for your brand.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Campaign Details */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Campaign Details
            </h2>

            <div className="space-y-5">

              {/* Title */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Campaign Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. New Skincare Product Launch"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Campaign Description / Brief
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your campaign. Example: We are launching a new Vitamin C face serum for young Indian women and want Instagram creators to promote it."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />

              </div>

              {/* Category + Platform */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Beauty, Fashion, Fitness..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Platform
                  </label>

                  <select
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                  >

                    <option value="Instagram">
                      Instagram
                    </option>

                    <option value="YouTube">
                      YouTube
                    </option>

                    <option value="Instagram + YouTube">
                      Instagram + YouTube
                    </option>

                  </select>

                </div>

              </div>

              {/* Budget + Followers */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Budget (₹)
                  </label>

                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="25000"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Minimum Followers
                  </label>

                  <input
                    type="number"
                    name="minFollowers"
                    value={form.minFollowers}
                    onChange={handleChange}
                    placeholder="10000"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                  />

                </div>

              </div>

              {/* Deliverables */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deliverables
                </label>

                <textarea
                  name="deliverables"
                  value={form.deliverables}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g. 1 Instagram Reel + 2 Stories"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />

              </div>

              {/* Target Audience */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Target Audience
                </label>

                <textarea
                  name="audience"
                  value={form.audience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g. 18-35, Beauty & Skincare enthusiasts"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-500"
                />

              </div>

            </div>
          </div>

          {/* AI Section */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-xl font-semibold text-gray-900">
                  AI Campaign Assistant
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your campaign brief above
                  and let AI generate the campaign
                  details automatically.
                </p>

              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {aiLoading
                  ? "✨ Generating..."
                  : "✨ Generate with AI"}
              </button>

            </div>
          </div>

          {/* Publish */}
          <div className="flex justify-end">

            <button
              type="submit"
              disabled={
                loading || aiLoading
              }
              className="rounded-xl bg-black px-7 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Publishing..."
                : "Publish Campaign"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;