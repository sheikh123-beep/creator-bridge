import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight"
          >
            Creator<span className="text-purple-600">Bridge</span>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">

            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              How it works
            </a>

            <a
              href="#features"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-gray-600 hover:text-purple-600 transition"
            >
              About
            </a>

          </div>


          {/* Navbar Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 text-sm font-medium hover:text-purple-600 transition"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="px-4 sm:px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition shadow-sm"
            >
              Get Started
            </Link>

          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="px-6 pt-20 md:pt-28 pb-24">

        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-7 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold border border-purple-100">
            ✨ The future of creator-brand collaboration
          </div>


          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">

            Where Brands Meet

            <span className="block text-purple-600 mt-2">
              Amazing Creators.
            </span>

          </h1>


          {/* Description */}
          <p className="max-w-2xl mx-auto mt-7 text-base sm:text-lg text-gray-600 leading-relaxed">

            Creator Bridge helps brands discover the right creators
            and gives creators a trusted place to collaborate,
            communicate and earn.

          </p>


          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-9">

            <Link
              to="/login"
              className="px-7 py-3.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
            >
              I'm a Creator →
            </Link>

            <Link
              to="/login"
              className="px-7 py-3.5 border border-gray-300 rounded-xl font-semibold hover:border-purple-600 hover:text-purple-600 transition"
            >
              I'm a Brand →
            </Link>

          </div>


          {/* Small trust text */}
          <p className="mt-6 text-sm text-gray-400">
            One platform. Better collaborations. Bigger opportunities.
          </p>

        </div>

      </section>


      {/* ================= STATS ================= */}
      <section className="border-y border-gray-100 bg-gray-50">

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">

          <div className="text-center py-8 border-r border-gray-100">
            <h3 className="text-3xl font-bold">
              10K+
            </h3>

            <p className="text-gray-500 mt-1">
              Creators
            </p>
          </div>


          <div className="text-center py-8 md:border-r border-gray-100">
            <h3 className="text-3xl font-bold">
              2K+
            </h3>

            <p className="text-gray-500 mt-1">
              Brands
            </p>
          </div>


          <div className="text-center py-8 border-r border-gray-100">
            <h3 className="text-3xl font-bold">
              5K+
            </h3>

            <p className="text-gray-500 mt-1">
              Collaborations
            </p>
          </div>


          <div className="text-center py-8">
            <h3 className="text-3xl font-bold">
              ₹50L+
            </h3>

            <p className="text-gray-500 mt-1">
              Creator Earnings
            </p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="px-6 py-24"
      >

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-purple-600 font-semibold text-sm tracking-wide">
              HOW IT WORKS
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">
              Simple. Private. Powerful.
            </h2>

            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Everything you need to turn ideas into successful collaborations.
            </p>

          </div>


          <div className="grid md:grid-cols-4 gap-8">

            {/* Step 1 */}
            <div className="text-center group">

              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-purple-100 text-purple-600 rounded-2xl text-lg font-bold group-hover:bg-purple-600 group-hover:text-white transition">
                01
              </div>

              <h3 className="font-bold text-lg mt-5">
                Create Profile
              </h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Build your creator or brand profile in minutes.
              </p>

            </div>


            {/* Step 2 */}
            <div className="text-center group">

              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-purple-100 text-purple-600 rounded-2xl text-lg font-bold group-hover:bg-purple-600 group-hover:text-white transition">
                02
              </div>

              <h3 className="font-bold text-lg mt-5">
                Discover
              </h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Find campaigns and creators that match your goals.
              </p>

            </div>


            {/* Step 3 */}
            <div className="text-center group">

              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-purple-100 text-purple-600 rounded-2xl text-lg font-bold group-hover:bg-purple-600 group-hover:text-white transition">
                03
              </div>

              <h3 className="font-bold text-lg mt-5">
                Connect Privately
              </h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Discuss campaigns directly through private chat.
              </p>

            </div>


            {/* Step 4 */}
            <div className="text-center group">

              <div className="w-14 h-14 mx-auto flex items-center justify-center bg-purple-100 text-purple-600 rounded-2xl text-lg font-bold group-hover:bg-purple-600 group-hover:text-white transition">
                04
              </div>

              <h3 className="font-bold text-lg mt-5">
                Collaborate & Earn
              </h3>

              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Complete collaborations and track your earnings.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="px-6 py-24 bg-gray-50"
      >

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-purple-600 font-semibold text-sm tracking-wide">
              PLATFORM FEATURES
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">
              Everything in one place.
            </h2>

            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              From discovering creators to private collaboration,
              Creator Bridge keeps everything simple.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">

            <div className="bg-white p-7 rounded-2xl border border-gray-100 hover:shadow-lg transition">

              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl text-xl">
                🔍
              </div>

              <h3 className="font-bold text-xl mt-5">
                Discover Creators
              </h3>

              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Brands can discover creators based on niche,
                followers, platform and budget.
              </p>

            </div>


            <div className="bg-white p-7 rounded-2xl border border-gray-100 hover:shadow-lg transition">

              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl text-xl">
                💬
              </div>

              <h3 className="font-bold text-xl mt-5">
                Private Chat
              </h3>

              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Brands and creators can discuss campaigns
                privately without leaving the platform.
              </p>

            </div>


            <div className="bg-white p-7 rounded-2xl border border-gray-100 hover:shadow-lg transition">

              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl text-xl">
                💰
              </div>

              <h3 className="font-bold text-xl mt-5">
                Collaborate & Earn
              </h3>

              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Manage collaborations and keep track of
                creator earnings in one place.
              </p>

            </div>

          </div>


          {/* ================= AI FEATURE ================= */}
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>

              <span className="text-purple-600 font-semibold text-sm">
                🤖 AI POWERED
              </span>

              <h2 className="text-4xl font-bold mt-4 tracking-tight">

                Find the right creator,

                <span className="text-purple-600">
                  {" "}faster.
                </span>

              </h2>

              <p className="text-gray-600 mt-5 leading-relaxed">

                Our AI analyzes campaign requirements, creator niche,
                audience size, platform and budget to recommend the
                most suitable creators.

              </p>

              <Link
                to="/login"
                className="inline-block mt-7 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Try AI Matching →
              </Link>

            </div>


            {/* AI Card */}
            <div className="bg-white rounded-3xl shadow-xl p-7 border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    AI Recommended
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    Top Creator Matches
                  </h3>

                </div>

                <span className="text-purple-600 text-2xl">
                  ✨
                </span>

              </div>


              <div className="mt-6 space-y-4">

                {/* Creator 1 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">

                  <div>

                    <p className="font-semibold">
                      Ananya Sharma
                    </p>

                    <p className="text-sm text-gray-500">
                      Fashion • 42.5K followers
                    </p>

                  </div>

                  <span className="font-bold text-purple-600">
                    94%
                  </span>

                </div>


                {/* Creator 2 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">

                  <div>

                    <p className="font-semibold">
                      Riya Patel
                    </p>

                    <p className="text-sm text-gray-500">
                      Beauty • 67K followers
                    </p>

                  </div>

                  <span className="font-bold text-purple-600">
                    89%
                  </span>

                </div>


                {/* Creator 3 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">

                  <div>

                    <p className="font-semibold">
                      Meera Singh
                    </p>

                    <p className="text-sm text-gray-500">
                      Lifestyle • 31K followers
                    </p>

                  </div>

                  <span className="font-bold text-purple-600">
                    84%
                  </span>

                </div>

              </div>


              <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">

                <p className="text-sm text-purple-700">
                  ✨ AI analyzes niche, audience,
                  platform and budget compatibility.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="px-6 py-24"
      >

        <div className="max-w-4xl mx-auto text-center">

          <p className="text-purple-600 font-semibold text-sm">
            ABOUT CREATOR BRIDGE
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Built for better collaborations.
          </h2>

          <p className="text-gray-600 mt-6 leading-relaxed max-w-2xl mx-auto">

            Creator Bridge brings brands and content creators
            together in one simple platform. Creators can showcase
            their audience and discover paid opportunities, while
            brands can find relevant creators and manage
            collaborations privately.

          </p>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="px-6 py-24">

        <div className="max-w-4xl mx-auto text-center bg-purple-600 rounded-3xl px-8 py-16 text-white shadow-xl">

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready to build your next collaboration?
          </h2>

          <p className="mt-5 text-purple-100 max-w-xl mx-auto">
            Join Creator Bridge and turn connections into opportunities.
          </p>

          <Link
            to="/login"
            className="inline-block mt-8 px-7 py-3.5 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Get Started →
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-100 px-6 py-8">

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          <Link
            to="/"
            className="text-xl font-bold"
          >
            Creator<span className="text-purple-600">
              Bridge
            </span>
          </Link>

          <div className="flex gap-6 text-sm text-gray-500">

            <a
              href="#how-it-works"
              className="hover:text-purple-600"
            >
              How it works
            </a>

            <a
              href="#features"
              className="hover:text-purple-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="hover:text-purple-600"
            >
              About
            </a>

          </div>

          <p className="text-sm text-gray-400">
            © 2026 Creator Bridge
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;