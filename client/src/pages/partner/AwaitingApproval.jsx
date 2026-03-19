import { useNavigate } from "react-router-dom";
import logo from "../../assets/partnerBridgeLogo.jpeg";

export default function AwaitingApproval() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-lg text-center border">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Partner Bridge"
            className="w-14 h-14 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          Awaiting Approval
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6">
          We've received your application. Our team is reviewing it and will
          notify you when access is granted.
        </p>

        {/* Status */}
        <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-6">
          In Review
        </div>

        {/* Review time */}
        <p className="text-sm text-gray-400 mb-8">
          Estimated review time: 24-48 hours
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-6 text-sm">

          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Log out
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Home
          </button>

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Need help? Contact support
        </p>

      </div>

    </div>

  );
}