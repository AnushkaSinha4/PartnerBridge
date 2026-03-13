import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  CheckSquare,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Receipt
} from "lucide-react";

import partnerBridgeLogo from "../assets/partnerBridgeLogo.jpeg";

const Sidebar = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const role = localStorage.getItem("role") || "admin";
  const isEmployee = role === "employee";

  /* ================= MAIN MENU ================= */

  const mainMenuItems = [
    { path: `/${role}/dashboard`, icon: LayoutDashboard, label: "Dashboard" },

    ...(!isEmployee
      ? [{ path: `/${role}/ecommerce`, icon: ShoppingCart, label: "E-commerce" }]
      : []),

    { path: `/${role}/partner`, icon: Users, label: "Partner" },
    { path: `/${role}/client`, icon: Users, label: "Client" },
    { path: `/${role}/employee`, icon: Users, label: "Employee" },

    // ⭐ NEW INVOICE MENU
    { path: `/${role}/invoices`, icon: Receipt, label: "Invoices" }
  ];

  /* ================= PROJECT MENU ================= */

  const projectMenuItems = [
    {
      path: `/${role}/tasks`,
      icon: CheckSquare,
      label: isEmployee ? "My Tasks" : "To Do"
    }
  ];

  /* ================= NAV ITEM ================= */

  const NavItem = ({ path, icon: Icon, label }) => (
    <NavLink
      to={path}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
        ${collapsed ? "justify-center" : ""}`
      }
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && label}
    </NavLink>
  );

  return (
    <aside
      className={`${
        collapsed ? "w-[68px]" : "w-64"
      } shrink-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
    >

      {/* ================= LOGO ================= */}

      <div className="flex items-center justify-between px-4 py-[18px] border-b border-gray-100">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <img
                  src={partnerBridgeLogo}
                  alt="PartnerBridge Logo"
                  className="w-14 h-8"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 tracking-tight whitespace-nowrap">
                  PartnerBridge
                </span>

                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  by Kavach Cloud Enterprises
                </span>
              </div>

            </div>

            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center w-full gap-2">

            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>

            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        )}
      </div>

      {/* ================= ROLE BADGE ================= */}

      {!collapsed && (
        <div className="px-3 pt-3 pb-1">

          <div
            className={`rounded-lg px-3 py-2 text-center text-xs font-bold uppercase tracking-wider
            ${
              isEmployee
                ? "bg-blue-50 text-blue-700 border border-blue-100"
                : "bg-purple-50 text-purple-700 border border-purple-100"
            }`}
          >
            Role: {role}
          </div>

        </div>
      )}

      {/* ================= MENU ================= */}

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">

        {/* MAIN */}
        <div>

          {!collapsed && (
            <p className="px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main
            </p>
          )}

          <div className="space-y-0.5">
            {mainMenuItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>

        </div>

        {/* PROJECTS */}
        <div>

          {!collapsed && (
            <p className="px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Projects
            </p>
          )}

          <div className="space-y-0.5">
            {projectMenuItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>

        </div>

      </div>

      {/* ================= USER PROFILE ================= */}

      <div className="p-3 border-t border-gray-100">

        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.firstName?.[0] || "A"}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {user?.email || "admin@company.com"}
              </p>

            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex justify-center p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        )}

      </div>

    </aside>
  );
};

export default Sidebar;