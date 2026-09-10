import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BrandProfile() {
  const navigate = useNavigate();

  const savedProfile =
    JSON.parse(localStorage.getItem("brandProfile")) || {};

  const [companyName, setCompanyName] = useState(
    savedProfile.companyName || ""
  );

  const [description, setDescription] = useState(
    savedProfile.description || ""
  );

  const [industry, setIndustry] = useState(
    savedProfile.industry || ""
  );

  const [location, setLocation] = useState(
    savedProfile.location || ""
  );

  const [website, setWebsite] = useState(
    savedProfile.website || ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again. Authentication token not found.");
      navigate("/login");
      return;
    }

    const brandData = {
      companyName,
      description,
      industry,
      location,
      website,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile/brand",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(brandData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save brand profile"
        );
      }

      // Keep localStorage for existing frontend pages
      localStorage.setItem(
        "brandProfile",
        JSON.stringify(brandData)
      );

      // Save returned MongoDB brand data locally
      if (data.brand) {
        localStorage.setItem(
          "brandMongoData",
          JSON.stringify(data.brand)
        );
      }

      alert("Brand profile saved successfully! 🎉");

      navigate("/brand-dashboard");
    } catch (error) {
      console.error("Brand profile error:", error);

      alert(
        error.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-purple-600"
          >
            Creator Bridge
          </Link>

          <Link
            to="/brand-dashboard"
            className="text-gray-600 hover:text-purple-600 font-medium"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Brand Profile
          </h1>

          <p className="text-gray-600 mt-2">
            Tell creators about your company and the kind of
            collaborations you offer.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-8 space-y-8"
        >
          {/* Company Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Company Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>

              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell creators about your company..."
                rows="5"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </section>

          {/* Industry */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Business Details
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>

                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select industry</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Technology">Technology</option>
                  <option value="Food & Beverage">
                    Food & Beverage
                  </option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Delhi, India"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* Website */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Online Presence
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>

              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </section>

          {/* Brand Logo */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Brand Logo
            </h2>

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl">
                🏢
              </div>

              <button
                type="button"
                className="border border-gray-300 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50"
              >
                Upload Logo
              </button>
            </div>
          </section>

          {/* Buttons */}
          <div className="border-t pt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/brand-dashboard"
              className="px-6 py-3 rounded-xl border border-gray-300 text-center font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Save Profile →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default BrandProfile;