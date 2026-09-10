import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://creator-bridge-backend.onrender.com";

function CreatorProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const savedProfile =
    JSON.parse(localStorage.getItem("creatorProfile")) || {};

  const [name, setName] = useState(savedProfile.name || "");
  const [username, setUsername] = useState(
    savedProfile.username || ""
  );
  const [bio, setBio] = useState(savedProfile.bio || "");
  const [category, setCategory] = useState(
    savedProfile.category || ""
  );

  const [instagramUsername, setInstagramUsername] =
    useState(savedProfile.instagramUsername || "");

  const [instagramFollowers, setInstagramFollowers] =
    useState(savedProfile.instagramFollowers || "");

  const [youtubeChannel, setYoutubeChannel] =
    useState(savedProfile.youtubeChannel || "");

  const [youtubeSubscribers, setYoutubeSubscribers] =
    useState(savedProfile.youtubeSubscribers || "");

  const [location, setLocation] = useState(
    savedProfile.location || ""
  );

  const [price, setPrice] = useState(
    savedProfile.price || ""
  );

  // --------------------------------------------------
  // PROFILE IMAGE
  // --------------------------------------------------
  const [profileImage, setProfileImage] = useState(
    savedProfile.profileImage || ""
  );

  // --------------------------------------------------
  // HANDLE PHOTO SELECT
  // --------------------------------------------------
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Keep image size reasonable for MongoDB/Base64 storage
    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // --------------------------------------------------
  // OPEN FILE PICKER
  // --------------------------------------------------
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // --------------------------------------------------
  // REMOVE PHOTO
  // --------------------------------------------------
  const handleRemovePhoto = () => {
    setProfileImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login again. Authentication token not found."
      );

      navigate("/login");
      return;
    }

    const creatorData = {
      name,
      username,
      bio,
      category,

      instagramUsername,
      instagramFollowers,

      youtubeChannel,
      youtubeSubscribers,

      location,
      price,

      // Save selected image
      profileImage,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/profile/creator`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(creatorData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save creator profile"
        );
      }

      // ------------------------------------------------
      // KEEP FRONTEND PROFILE DATA
      // ------------------------------------------------
      localStorage.setItem(
        "creatorProfile",
        JSON.stringify(creatorData)
      );

      // ------------------------------------------------
      // SAVE RETURNED MONGODB DATA
      // ------------------------------------------------
      if (data.creator) {
        localStorage.setItem(
          "creatorMongoData",
          JSON.stringify(data.creator)
        );
      }

      alert(
        "Creator profile saved successfully! 🎉"
      );

      navigate("/creator-dashboard");
    } catch (error) {
      console.error(
        "Creator profile error:",
        error
      );

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
            to="/creator-dashboard"
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
            Create Your Creator Profile
          </h1>

          <p className="text-gray-600 mt-2">
            Tell brands about yourself and showcase your
            creator stats.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-8 space-y-8"
        >
          {/* Basic Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="@yourusername"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Tell brands about yourself..."
                rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creator Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">
                  Select category
                </option>

                <option value="Beauty">
                  Beauty
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Fitness">
                  Fitness
                </option>

                <option value="Lifestyle">
                  Lifestyle
                </option>

                <option value="Technology">
                  Technology
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Gaming">
                  Gaming
                </option>

                <option value="Education">
                  Education
                </option>
              </select>
            </div>
          </section>

          {/* Instagram */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Instagram
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Username
                </label>

                <input
                  type="text"
                  value={instagramUsername}
                  onChange={(e) =>
                    setInstagramUsername(
                      e.target.value
                    )
                  }
                  placeholder="@yourusername"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Followers
                </label>

                <input
                  type="number"
                  value={instagramFollowers}
                  onChange={(e) =>
                    setInstagramFollowers(
                      e.target.value
                    )
                  }
                  placeholder="50000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* YouTube */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              YouTube
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Channel
                </label>

                <input
                  type="text"
                  value={youtubeChannel}
                  onChange={(e) =>
                    setYoutubeChannel(
                      e.target.value
                    )
                  }
                  placeholder="Your channel name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Subscribers
                </label>

                <input
                  type="number"
                  value={youtubeSubscribers}
                  onChange={(e) =>
                    setYoutubeSubscribers(
                      e.target.value
                    )
                  }
                  placeholder="25000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* Other Details */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Other Details
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Mumbai, India"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price (₹)
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="15000"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* Profile Photo */}
          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Profile Photo
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {/* Image Preview */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center text-3xl border-2 border-purple-100">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Creator profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>👤</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="border border-gray-300 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  📷 Upload Photo
                </button>

                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="border border-red-200 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-medium hover:bg-red-100 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              JPG, PNG or other image formats. Maximum size
              2MB.
            </p>
          </section>

          {/* Buttons */}
          <div className="border-t pt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/creator-dashboard"
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

export default CreatorProfile;