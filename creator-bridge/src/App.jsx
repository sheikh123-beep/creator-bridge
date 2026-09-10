import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Otp from "./pages/Otp";

import CreatorProfile from "./pages/CreatorProfile";
import BrandProfile from "./pages/BrandProfile";

import CreatorDashboard from "./pages/CreatorDashboard";
import BrandDashboard from "./pages/BrandDashboard";

import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";

import CreatorDiscovery from "./pages/CreatorDiscovery";
import CreatorPublicProfile from "./pages/CreatorPublicProfile";

import Application from "./pages/Application";
import Chat from "./pages/Chat";
import Earnings from "./pages/Earnings";

import AIMatching from "./pages/AIMatching";
import CreateCampaign from "./pages/CreateCampaign";

// --------------------------------------------------
// AUTH CHECK
// --------------------------------------------------

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// --------------------------------------------------
// PROTECTED ROUTE
// --------------------------------------------------

function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// --------------------------------------------------
// LOGIN ROUTE
// --------------------------------------------------

function LoginRoute() {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (token && savedUser) {
    try {
      const user = JSON.parse(savedUser);

      if (user.role === "creator") {
        return (
          <Navigate
            to="/creator-dashboard"
            replace
          />
        );
      }

      if (user.role === "brand") {
        return (
          <Navigate
            to="/brand-dashboard"
            replace
          />
        );
      }
    } catch (error) {
      console.error(
        "Saved user parsing error:",
        error
      );
    }
  }

  return <Login />;
}

// --------------------------------------------------
// APP
// --------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------------------------------- */}
        {/* LANDING */}
        {/* ---------------------------------------- */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ---------------------------------------- */}
        {/* AUTHENTICATION */}
        {/* ---------------------------------------- */}

        <Route
          path="/login"
          element={<LoginRoute />}
        />

        <Route
          path="/otp"
          element={<Otp />}
        />

        {/* ---------------------------------------- */}
        {/* PROFILES */}
        {/* ---------------------------------------- */}

        <Route
          path="/creator-profile"
          element={
            <ProtectedRoute>
              <CreatorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-profile"
          element={
            <ProtectedRoute>
              <BrandProfile />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* DASHBOARDS */}
        {/* ---------------------------------------- */}

        <Route
          path="/creator-dashboard"
          element={
            <ProtectedRoute>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-dashboard"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* CAMPAIGNS */}
        {/* ---------------------------------------- */}

        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaign-details"
          element={
            <ProtectedRoute>
              <CampaignDetails />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* CREATOR APPLICATION FLOW */}
        {/* ---------------------------------------- */}

        <Route
          path="/application"
          element={
            <ProtectedRoute>
              <Application />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <Application />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* CHAT */}
        {/* ---------------------------------------- */}

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* EARNINGS */}
        {/* ---------------------------------------- */}

        <Route
          path="/earnings"
          element={
            <ProtectedRoute>
              <Earnings />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* BRAND FLOW */}
        {/* ---------------------------------------- */}

        <Route
          path="/creator-discovery"
          element={
            <ProtectedRoute>
              <CreatorDiscovery />
            </ProtectedRoute>
          }
        />

        {/* Creator Public Profile */}
        <Route
          path="/creator-profile-view/:id"
          element={
            <ProtectedRoute>
              <CreatorPublicProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-matching"
          element={
            <ProtectedRoute>
              <AIMatching />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />

        {/* ---------------------------------------- */}
        {/* UNKNOWN ROUTE */}
        {/* ---------------------------------------- */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;