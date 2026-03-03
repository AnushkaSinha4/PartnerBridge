

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, FolderOpen,
  Calendar, MessageSquare, User, LogOut,
  ChevronLeft, ChevronRight, Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import partnerBridgeLogo from "../../assets/partnerBridgeLogo.jpeg";

const navItems = [
  { to: "/employee/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/employee/tasks",     label: "My Tasks",  Icon: ClipboardList },
  { to: "/employee/projects",  label: "Projects",  Icon: FolderOpen },
  // { to: "/employee/calendar",  label: "Calendar",  Icon: Calendar },
  // { to: "/employee/chat",      label: "Chat",      Icon: MessageSquare },
];

const EmployeeSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ firstName: "Employee", lastName: "" });

  useEffect(() => {
    try {
      const s = localStorage.getItem("user");
      if (s) setUser(JSON.parse(s));
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={`
        ${collapsed ? "w-[68px]" : "w-64"}
        shrink-0 h-screen bg-white border-r border-gray-200
        flex flex-col transition-all duration-300 overflow-hidden
      `}
    >
      {/* Logo Row */}
      <div className="flex items-center justify-between px-4 py-[18px] border-b border-gray-100">
        {!collapsed ? (
          <>
             <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                      <img src={partnerBridgeLogo} alt="PartnerBridge Logo" className="w-14 h-8" />
                  </div>
                          
                  <div className="flex flex-col">
                      <span className="text-base font-bold text-gray-900 tracking-tight whitespace-nowrap">PartnerBridge</span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">by Kavach Cloud Enterprises</span>
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

      {/* User Info */}
      {/* {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs font-medium text-blue-600">Employee</p>
            </div>
          </div>
        </div>
      )} */}

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </p>
        )}
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
              ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-red-500 hover:bg-red-50 transition-colors w-full
            ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;