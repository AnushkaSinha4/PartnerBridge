import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Users from "./pages/admin/Users.jsx";
/*  NEW ADMIN PAGE (Partners Approval) */
import AdminPartners from "./pages/admin/AdminPartners.jsx";
import InvoicesPage from "./pages/admin/InvoicesPage.jsx";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeTasks from "./pages/employee/EmployeeTasks.jsx";
import EmployeeProjects from "./pages/employee/EmployeeProjects.jsx";
import EmployeeProjectDetail from "./pages/employee/EmployeeProjectDetails.jsx";

/* NEW PARTNER PAGES */
import PartnerOnboarding from "./pages/partner/PartnerOnboarding.jsx";
import AwaitingApproval from "./pages/partner/AwaitingApproval.jsx";
import PartnerRouter from "./pages/partner/PartnerRouter.jsx";
import PartnerDashboard from "./pages/partner/PartnerDashboard.jsx";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
  //   return <Navigate to={`/${userRole}/dashboard`} />;
  // }
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}

        {/* ADMIN DEFAULT REDIRECT */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN PARTNERS (Approve / Reject Partners) */}
        <Route
          path="/admin/partners"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <AdminPartners />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN INVOICES */}
        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <InvoicesPage />
               </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYEE ================= */}

        <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/projects"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/projects/:projectId"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeProjectDetail />
            </ProtectedRoute>
          }
        />

        {/* ================= PARTNER ================= */}

        {/* Main Partner Router (checks onboarding status) */}
        <Route
          path="/partner"
          element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <PartnerRouter />
            </ProtectedRoute>
          }
        />

        {/* Partner Onboarding Form */}
        <Route
          path="/partner/onboarding"
          element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <PartnerOnboarding />
            </ProtectedRoute>
          }
        />

        {/* Awaiting Approval Screen */}
        <Route
          path="/partner/awaiting-approval"
          element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <AwaitingApproval />
            </ProtectedRoute>
          }
        />

        <Route
           path="/partner/dashboard"
           element={
              <ProtectedRoute allowedRoles={["partner"]}>
               <PartnerDashboard />
              </ProtectedRoute>
           }
        />

        {/* ================= DEFAULT ================= */}

        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;