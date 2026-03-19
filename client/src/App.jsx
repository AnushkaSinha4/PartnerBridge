import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Leads from "./pages/partner/Leads.jsx";

/* ADMIN MANAGEMENT PAGES */
import Partner from "./pages/admin/Partner.jsx";
import Client from "./pages/admin/Client.jsx";
import Employee from "./pages/admin/Employee.jsx";

/* ADMIN PARTNER APPROVAL */
import AdminPartners from "./pages/admin/AdminPartners.jsx";
import PartnerDetails from "./pages/admin/PartnerDetails.jsx";

/* EMPLOYEE PAGES */
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeTasks from "./pages/employee/EmployeeTasks.jsx";
import EmployeeProjects from "./pages/employee/EmployeeProjects.jsx";
import EmployeeProjectDetail from "./pages/employee/EmployeeProjectDetails.jsx";

/* INVOICE PAGES */
import Invoices from "./pages/admin/Invoices.jsx";
import ViewInvoice from "./pages/admin/ViewInvoice.jsx";
import EditInvoice from "./pages/EditInvoice.jsx";
import CreateInvoice from "./pages/admin/CreateInvoice.jsx";

/* PARTNER PAGES */
import PartnerOnboarding from "./pages/partner/PartnerOnboarding.jsx";
import AwaitingApproval from "./pages/partner/AwaitingApproval.jsx";
import PartnerRouter from "./pages/partner/PartnerRouter.jsx";
import PartnerDashboard from "./pages/partner/PartnerDashboard.jsx";

/* ================= PROTECTED ROUTE ================= */

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "employee") {
      return <Navigate to="/employee/dashboard" replace />;
    }
    if (role === "partner") {
      return <Navigate to="/partner/dashboard" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= ADMIN ================= */}

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

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

        {/* ADMIN PARTNER APPROVAL */}
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

        <Route
          path="/admin/partners/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <PartnerDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN MANAGEMENT */}
        <Route
          path="/admin/partner"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <Partner />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/client"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <Client />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employee"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <Employee />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= INVOICES ================= */}

        <Route
          path="/admin/invoices"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <Invoices />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/invoices/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <ViewInvoice />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/invoices/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <EditInvoice />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-invoice"
          element={
            <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
              <AdminLayout>
                <CreateInvoice />
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

        <Route
          path="/partner"
          element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <PartnerRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/partner/onboarding"
          element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <PartnerOnboarding />
            </ProtectedRoute>
          }
        />

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
              <AdminLayout>
                <PartnerDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED: Leads now wrapped inside AdminLayout */}
        <Route
          path="/partner/leads"
          element={
            <ProtectedRoute allowedRoles={["partner"]}>
              <AdminLayout>
                <Leads />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;