


import React, { useState } from "react";
import EmployeeSidebar from "./EmployeeSidebar.jsx";
import EmployeeNavbar from "./EmployeeNavbar.jsx";

const EmployeeLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - part of flex, NOT fixed */}
      <EmployeeSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main area takes remaining width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <EmployeeNavbar
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;