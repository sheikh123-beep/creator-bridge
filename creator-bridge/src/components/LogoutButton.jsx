import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedCampaign");
    localStorage.removeItem("currentChat");
    localStorage.removeItem("application");

    navigate("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
    >
      Logout
    </button>
  );
}

export default LogoutButton;