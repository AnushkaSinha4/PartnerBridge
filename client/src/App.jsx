import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";


import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";

import Partner from "./pages/admin/Partner.jsx";
import Client from "./pages/admin/Client.jsx";
import Employee from "./pages/admin/Employee.jsx";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeTasks from "./pages/employee/EmployeeTasks.jsx";
import EmployeeProjects from "./pages/employee/EmployeeProjects.jsx";
import EmployeeProjectDetail from "./pages/employee/EmployeeProjectDetails.jsx";
import Invoices from "./pages/admin/Invoices";
import ViewInvoice from "./pages/admin/ViewInvoice.jsx";
import EditInvoice from "./pages/EditInvoice";

// 🔒 Protected Route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // role restriction
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {

    if (role === "employee") {
      return <Navigate to="/employee/dashboard" replace />;
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

       
        


        {/* ADMIN DEFAULT */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
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
   <ProtectedRoute allowedRoles={["admin","super_admin"]}>
     <AdminLayout>
       <ViewInvoice/>
     </AdminLayout>
   </ProtectedRoute>
 }
/>

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

<Route
path="/admin/invoices/edit/:id"
element={<EditInvoice/>}
/>
        {/* ADMIN PARTNER */}
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


        {/* ADMIN CLIENT */}
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


        {/* ADMIN EMPLOYEE */}
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


        {/* EMPLOYEE DEFAULT */}
        <Route
          path="/employee"
          element={<Navigate to="/employee/dashboard" replace />}
        />


        {/* EMPLOYEE DASHBOARD */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />


        {/* EMPLOYEE TASKS */}
        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeTasks />
            </ProtectedRoute>
          }
        />
           <Route
  path="/admin/invoices/:id"
  element={<ViewInvoice />}
/>

        {/* EMPLOYEE PROJECTS */}
        <Route
          path="/employee/projects"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeProjects />
            </ProtectedRoute>
          }
        />


        {/* PROJECT DETAIL */}
        <Route
          path="/employee/projects/:projectId"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin", "super_admin"]}>
              <EmployeeProjectDetail />
            </ProtectedRoute>
          }
        />


        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>

    </BrowserRouter>

  );

}


export default App;