import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Users from "./pages/admin/Users.jsx";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeTasks from "./pages/employee/EmployeeTasks.jsx";
import EmployeeProjects from "./pages/employee/EmployeeProjects.jsx";
import EmployeeProjectDetail from "./pages/employee/EmployeeProjectDetails.jsx";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}/dashboard`} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* 🔥 ADMIN DEFAULT REDIRECT */}
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

        {/* EMPLOYEE DEFAULT REDIRECT */}
        <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />

        {/* EMPLOYEE ROUTES */}
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

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
