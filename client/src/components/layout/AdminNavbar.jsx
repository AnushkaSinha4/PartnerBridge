import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, Menu, Shield } from "lucide-react";

const AdminNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const initials = `${user.firstName?.[0] || "A"}${user.lastName?.[0] || ""}`;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-5 gap-4 shrink-0 z-10">
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="relative hidden md:block flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects, tasks, users..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800 leading-none">
                {user.firstName || "Admin"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-50">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email || "admin@company.com"}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-purple-600 font-medium">Administrator</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/profile")}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/admin/settings")}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Settings
            </button>
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => { localStorage.clear(); navigate("/login"); }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;