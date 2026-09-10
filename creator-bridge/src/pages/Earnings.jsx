import { Link } from "react-router-dom";

function Earnings() {
  const payments = [
    {
      brand: "Glow Beauty",
      campaign: "Summer Skincare Campaign",
      amount: "₹15,000",
      status: "Paid",
      date: "28 Aug 2026",
    },
    {
      brand: "Urban Threads",
      campaign: "New Summer Collection",
      amount: "₹20,000",
      status: "Pending",
      date: "25 Aug 2026",
    },
    {
      brand: "FitFuel",
      campaign: "Healthy Lifestyle Campaign",
      amount: "₹12,000",
      status: "Paid",
      date: "18 Aug 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Creator<span className="text-purple-600">Bridge</span>
          </Link>

          <Link
            to="/creator-dashboard"
            className="text-sm font-medium text-gray-600 hover:text-purple-600"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Earnings & Payments
          </h1>
          <p className="text-gray-500 mt-2">
            Track your campaign earnings and payment status.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <h2 className="text-3xl font-bold mt-2">₹47,000</h2>
            <p className="text-sm text-green-600 mt-2">
              ↑ 18% this month
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Paid</p>
            <h2 className="text-3xl font-bold mt-2">₹27,000</h2>
            <p className="text-sm text-gray-500 mt-2">
              Successfully received
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold mt-2">₹20,000</h2>
            <p className="text-sm text-orange-600 mt-2">
              Awaiting payment
            </p>
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Payment History</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {payments.map((payment, index) => (
              <div
                key={index}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {payment.campaign}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {payment.brand} • {payment.date}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <p className="font-bold text-lg">
                    {payment.amount}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future payment integration */}
        <div className="mt-6 bg-purple-50 border border-purple-100 rounded-2xl p-6">
          <h3 className="font-bold text-purple-900">
            🔒 Secure Payments
          </h3>
          <p className="text-sm text-purple-700 mt-2">
            Creator Bridge will support secure online payments through
            payment gateways such as Razorpay or Stripe in the production
            version.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Earnings;