import React, { useState } from "react";
import Sidebar from "../Sidebar.jsx";
import AdminNavbar from "./AdminNavbar.jsx";

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - flex child, NOT fixed */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main area takes remaining width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


