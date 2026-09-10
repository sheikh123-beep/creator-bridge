import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function CreatorDiscovery() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [creators, setCreators] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All Categories");

  const [followersFilter, setFollowersFilter] =
    useState("Any Followers");

  // --------------------------------------------------
  // FETCH REAL CREATORS
  // --------------------------------------------------

  useEffect(() => {
    const fetchCreators = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/creators`,
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
              "Failed to fetch creators"
          );
        }

        const realCreators = (
          data.creators || []
        ).map((creator) => ({
          id: creator._id,

          name:
            creator.name ||
            "Creator",

          username:
            creator.username ||
            "",

          bio:
            creator.bio ||
            "",

          category:
            creator.category ||
            "General",

          instagramUsername:
            creator.instagram?.username ||
            "",

          followers:
            Number(
              creator.instagram?.followers || 0
            ),

          youtubeChannel:
            creator.youtube?.channel ||
            "",

          subscribers:
            Number(
              creator.youtube?.subscribers || 0
            ),

          location:
            creator.location ||
            "India",

          price:
            Number(
              creator.price || 0
            ),

          profileImage:
            creator.profileImage ||
            "",

          createdAt:
            creator.createdAt,
        }));

        setCreators(realCreators);
      } catch (err) {
        console.error(
          "Creator discovery error:",
          err
        );

        setError(
          err.message ||
            "Unable to load creators."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [token]);

  // --------------------------------------------------
  // FILTER CREATORS
  // --------------------------------------------------

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        creator.name
          .toLowerCase()
          .includes(searchText) ||
        creator.username
          .toLowerCase()
          .includes(searchText) ||
        creator.category
          .toLowerCase()
          .includes(searchText) ||
        creator.location
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All Categories" ||
        creator.category.toLowerCase() ===
          category.toLowerCase();

      let matchesFollowers = true;

      if (followersFilter === "10K+") {
        matchesFollowers =
          creator.followers >= 10000;
      }

      if (followersFilter === "50K+") {
        matchesFollowers =
          creator.followers >= 50000;
      }

      if (followersFilter === "100K+") {
        matchesFollowers =
          creator.followers >= 100000;
      }

      if (followersFilter === "500K+") {
        matchesFollowers =
          creator.followers >= 500000;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFollowers
      );
    });
  }, [
    creators,
    search,
    category,
    followersFilter,
  ]);

  // --------------------------------------------------
  // OPEN CREATOR PROFILE
  // --------------------------------------------------

  const handleViewProfile = (creator) => {
    localStorage.setItem(
      "selectedCreator",
      JSON.stringify(creator)
    );

    navigate(
      `/creator-profile-view/${creator.id}`
    );
  };

  // --------------------------------------------------
  // FORMAT FOLLOWERS
  // --------------------------------------------------

  const formatFollowers = (number) => {
    if (!number) {
      return "0";
    }

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }

    return number.toLocaleString("en-IN");
  };

  // --------------------------------------------------
  // FORMAT PRICE
  // --------------------------------------------------

  const formatPrice = (price) => {
    if (!price) {
      return "Negotiable";
    }

    return `₹${Number(price).toLocaleString(
      "en-IN"
    )}`;
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
            to="/brand-dashboard"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}

        <div className="mb-8">

          <p className="text-purple-600 text-sm font-semibold">
            CREATOR DISCOVERY
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Find the perfect creators
          </h1>

          <p className="text-gray-500 mt-2">
            Discover creators based on niche,
            audience and social reach.
          </p>

        </div>

        {/* Search & Filters */}

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8">

          <div className="grid md:grid-cols-4 gap-3">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search creators..."
              className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>
                All Categories
              </option>

              <option>
                Fashion
              </option>

              <option>
                Beauty
              </option>

              <option>
                Fitness
              </option>

              <option>
                Lifestyle
              </option>

              <option>
                Technology
              </option>

              <option>
                Travel
              </option>
            </select>

            <select
              value={followersFilter}
              onChange={(e) =>
                setFollowersFilter(
                  e.target.value
                )
              }
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>
                Any Followers
              </option>

              <option>
                10K+
              </option>

              <option>
                50K+
              </option>

              <option>
                100K+
              </option>

              <option>
                500K+
              </option>
            </select>

          </div>

        </div>

        {/* AI Banner */}

        <div className="bg-purple-600 text-white rounded-2xl p-6 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm font-semibold text-purple-200">
                ✨ AI RECOMMENDATIONS
              </p>

              <h2 className="text-xl md:text-2xl font-bold mt-1">
                Find creators for your campaigns
              </h2>

              <p className="text-purple-100 text-sm mt-1">
                Use AI Matching to rank creators
                according to your campaign requirements.
              </p>

            </div>

            <div className="bg-white/15 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap">
              {filteredCreators.length} creators found
            </div>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}

        {loading ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-4xl mb-3">
              ⏳
            </div>

            <h2 className="font-semibold text-gray-900">
              Loading creators...
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Fetching creators from Creator Bridge.
            </p>

          </div>

        ) : filteredCreators.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-4">
              🔎
            </div>

            <h2 className="text-xl font-bold">
              No creators found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setFollowersFilter("Any Followers");
              }}
              className="mt-5 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* Creator Grid */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredCreators.map(
              (creator) => (

                <div
                  key={creator.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      {creator.profileImage ? (
                        <img
                          src={
                            creator.profileImage
                          }
                          alt={creator.name}
                          className="w-14 h-14 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                          👤
                        </div>
                      )}

                      <div>

                        <h3 className="font-bold">
                          {creator.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {creator.username
                            ? `@${creator.username.replace(
                                /^@/,
                                ""
                              )}`
                            : "Creator"}
                        </p>

                      </div>

                    </div>

                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Creator
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">

                    <span className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {creator.category}
                    </span>

                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg">
                      {creator.location}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-xs text-gray-400">
                        Instagram
                      </p>

                      <p className="font-bold mt-1">
                        {formatFollowers(
                          creator.followers
                        )}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        followers
                      </p>

                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">

                      <p className="text-xs text-gray-400">
                        YouTube
                      </p>

                      <p className="font-bold mt-1">
                        {formatFollowers(
                          creator.subscribers
                        )}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        subscribers
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

                    <div>

                      <p className="text-xs text-gray-400">
                        Starting price
                      </p>

                      <p className="font-bold mt-1">
                        {formatPrice(
                          creator.price
                        )}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleViewProfile(
                          creator
                        )
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                    >
                      View Profile
                    </button>

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

export default CreatorDiscovery;