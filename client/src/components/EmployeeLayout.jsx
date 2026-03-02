import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <div
        style={{
          height: "60px",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <h3>Employee Panel</h3>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <Outlet />
    </div>
  );
};

export default EmployeeLayout;