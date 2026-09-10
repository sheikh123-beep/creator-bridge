import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const defaultCampaigns = [
  {
    id: "glow-beauty",
    brand: "Glow Beauty",
    title: "Summer Skincare Campaign",
    category: "Beauty",
    budget: "₹15,000",
    followers: "10K+",
    description:
      "Promote Glow Beauty's summer skincare collection through engaging Instagram content.",
    platform: "Instagram",
    deliverables: "1 Reel + 2 Stories",
    audience: "Beauty and skincare audience",
    status: "Active",
  },
  {
    id: "urban-threads",
    brand: "Urban Threads",
    title: "Summer Fashion Collection",
    category: "Fashion",
    budget: "₹20,000",
    followers: "25K+",
    description:
      "Create stylish content featuring the latest summer fashion collection.",
    platform: "Instagram",
    deliverables: "1 Reel + 2 Stories",
    audience: "Fashion and lifestyle audience",
    status: "Active",
  },
  {
    id: "fitfuel",
    brand: "FitFuel",
    title: "Healthy Lifestyle Campaign",
    category: "Fitness",
    budget: "₹12,000",
    followers: "15K+",
    description:
      "Create authentic fitness and healthy lifestyle content for FitFuel.",
    platform: "Instagram",
    deliverables: "1 Reel + 1 Story",
    audience: "Fitness and wellness audience",
    status: "Active",
  },
  {
    id: "technova",
    brand: "TechNova",
    title: "Smart Gadget Launch",
    category: "Technology",
    budget: "₹30,000",
    followers: "20K+",
    description:
      "Showcase the features and real-world use of TechNova's latest smart gadget.",
    platform: "YouTube",
    deliverables: "1 Video + 1 Short",
    audience: "Technology and gadget audience",
    status: "Active",
  },
  {
    id: "travelnest",
    brand: "TravelNest",
    title: "Explore India",
    category: "Travel",
    budget: "₹25,000",
    followers: "30K+",
    description:
      "Create travel content highlighting beautiful destinations across India.",
    platform: "Instagram",
    deliverables: "1 Reel + 3 Stories",
    audience: "Travel and adventure audience",
    status: "Active",
  },
  {
    id: "foodiebox",
    brand: "FoodieBox",
    title: "New Food Subscription",
    category: "Food",
    budget: "₹10,000",
    followers: "10K+",
    description:
      "Introduce FoodieBox's new subscription service through engaging food content.",
    platform: "Instagram",
    deliverables: "1 Reel + 2 Stories",
    audience: "Food and lifestyle audience",
    status: "Active",
  },
];

function Campaigns() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [budget, setBudget] = useState("Any Budget");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // Fetch campaigns from MongoDB
  // --------------------------------
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view campaigns.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/campaigns",
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
            data.message || "Failed to fetch campaigns"
          );
        }

        const mongoCampaigns = (data.campaigns || []).map(
          (campaign) => ({
            id: campaign._id,

            mongoId: campaign._id,

            brand:
              campaign.brandId?.companyName ||
              "Brand",

            title: campaign.title,

            category: campaign.category,

            budget: `₹${Number(
              campaign.budget || 0
            ).toLocaleString("en-IN")}`,

            minFollowers:
              campaign.minFollowers || 0,

            followers: campaign.minFollowers
              ? `${Number(
                  campaign.minFollowers
                ).toLocaleString("en-IN")}+`
              : "Not specified",

            description:
              campaign.description || "",

            platform:
              campaign.platform || "Instagram",

            deliverables:
              campaign.requirements || "",

            audience:
              campaign.audience || "General audience",

            status:
              campaign.status === "active"
                ? "Active"
                : campaign.status || "Active",

            applications:
              campaign.applications || 0,

            createdAt:
              campaign.createdAt,
          })
        );

        setCampaigns(mongoCampaigns);
      } catch (err) {
        console.error(
          "Campaign fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load campaigns."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // --------------------------------
  // Combine MongoDB + demo campaigns
  // --------------------------------
  const allCampaigns = [
    ...campaigns,
    ...defaultCampaigns,
  ];

  // --------------------------------
  // Filter campaigns
  // --------------------------------
  const filteredCampaigns = useMemo(() => {
    return allCampaigns.filter((campaign) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        campaign.title
          ?.toLowerCase()
          .includes(searchText) ||
        campaign.brand
          ?.toLowerCase()
          .includes(searchText) ||
        campaign.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All Categories" ||
        campaign.category === category;

      let matchesBudget = true;

      const amount = Number(
        String(campaign.budget || "")
          .replace(/[₹,]/g, "")
          .replace(/[^\d]/g, "")
      );

      if (budget === "Under ₹10K") {
        matchesBudget = amount < 10000;
      }

      if (budget === "₹10K - ₹25K") {
        matchesBudget =
          amount >= 10000 &&
          amount <= 25000;
      }

      if (budget === "₹25K+") {
        matchesBudget =
          amount > 25000;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBudget
      );
    });
  }, [
    campaigns,
    search,
    category,
    budget,
  ]);

  // --------------------------------
  // Select campaign
  // --------------------------------
  const handleCampaignClick = (
    campaign
  ) => {
    localStorage.setItem(
      "selectedCampaign",
      JSON.stringify(campaign)
    );
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

          <Link
            to="/creator-dashboard"
            className="text-sm font-semibold text-purple-600"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-purple-600 text-sm font-semibold">
            CAMPAIGNS
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Find your next collaboration
          </h1>

          <p className="text-gray-500 mt-2">
            Explore campaigns from brands looking for creators like you.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Search + Filter */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none"
          >
            <option>All Categories</option>
            <option>Fashion</option>
            <option>Beauty</option>
            <option>Fitness</option>
            <option>Lifestyle</option>
            <option>Technology</option>
            <option>Travel</option>
            <option>Food</option>
          </select>

          <select
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value)
            }
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none"
          >
            <option>Any Budget</option>
            <option>Under ₹10K</option>
            <option>₹10K - ₹25K</option>
            <option>₹25K+</option>
          </select>
        </div>

        {/* Result Count */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {loading
                ? "..."
                : filteredCampaigns.length}
            </span>{" "}
            campaign
            {filteredCampaigns.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
            <div className="text-4xl mb-3">
              ⏳
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Loading campaigns...
            </h2>

            <p className="text-gray-500 mt-2">
              Fetching live campaigns from Creator Bridge.
            </p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl py-16 text-center">
            <div className="text-4xl mb-3">
              🔍
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              No campaigns found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory(
                  "All Categories"
                );
                setBudget("Any Budget");
              }}
              className="mt-5 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map(
              (campaign) => (
                <div
                  key={
                    campaign.id ||
                    campaign.title
                  }
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                      🏢
                    </div>

                    <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-full h-fit">
                      {campaign.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-5">
                    {campaign.brand ||
                      "Brand"}
                  </p>

                  <h2 className="font-bold text-lg mt-1">
                    {campaign.title}
                  </h2>

                  {campaign.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}

                  <div className="space-y-3 mt-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Budget
                      </span>

                      <span className="font-semibold">
                        {campaign.budget ||
                          "Negotiable"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Minimum audience
                      </span>

                      <span className="font-semibold">
                        {campaign.followers ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/campaign-details"
                    onClick={() =>
                      handleCampaignClick(
                        campaign
                      )
                    }
                    className="block text-center mt-6 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                  >
                    View Campaign →
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Campaigns;