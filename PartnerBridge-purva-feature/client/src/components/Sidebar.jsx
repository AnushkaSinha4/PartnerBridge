import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const mainMenuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/admin/ecommerce", icon: "🛒", label: "E-commerce" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/support", icon: "💬", label: "Support" },
    { path: "/admin/projects", icon: "📁", label: "Projects" },
  ];

  const projectMenuItems = [
    { path: "/admin/todo", icon: "✅", label: "To Do" },
    { path: "/admin/all-projects", icon: "📂", label: "All Projects" },
    { path: "/admin/my-projects", icon: "⭐", label: "My Projects" },
    { path: "/admin/project-summary", icon: "📊", label: "Project Summary" },
    { path: "/admin/my-tasks", icon: "📋", label: "My Tasks" },
    { path: "/admin/all-files", icon: "📄", label: "All Files" },
  ];

  return (
    <div style={{
      ...styles.sidebar,
      width: collapsed ? "80px" : "280px"
    }}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚡</span>
        {!collapsed && <span style={styles.logoText}>Flowbite</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={styles.collapseBtn}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Main Menu */}
      <div style={styles.menuSection}>
        {!collapsed && <div style={styles.sectionTitle}>Dashboards</div>}
        {mainMenuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({isActive}) => ({
              ...styles.menuItem,
              backgroundColor: isActive ? "#f3f4f6" : "transparent",
              color: isActive ? "#1f2937" : "#6b7280",
              justifyContent: collapsed ? "center" : "flex-start"
            })}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Project Menu */}
      <div style={styles.menuSection}>
        {!collapsed && <div style={styles.sectionTitle}>Projects</div>}
        {projectMenuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({isActive}) => ({
              ...styles.menuItem,
              backgroundColor: isActive ? "#f3f4f6" : "transparent",
              color: isActive ? "#1f2937" : "#6b7280",
              justifyContent: collapsed ? "center" : "flex-start"
            })}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div style={styles.userProfile}>
          <div style={styles.userAvatar}>👤</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>Admin User</div>
            <div style={styles.userEmail}>admin@company.com</div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  sidebar: {
    height: "100vh",
    backgroundColor: "white",
    borderRight: "1px solid #e5e7eb",
    transition: "width 0.3s",
    overflow: "hidden",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column"
  },
  logo: {
    padding: "24px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid #e5e7eb"
  },
  logoIcon: {
    fontSize: "24px"
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    flex: 1
  },
  collapseBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#9ca3af",
    padding: "4px"
  },
  menuSection: {
    padding: "20px 12px",
    borderBottom: "1px solid #e5e7eb"
  },
  sectionTitle: {
    padding: "0 12px 12px",
    color: "#9ca3af",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "2px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  menuIcon: {
    fontSize: "18px"
  },
  userProfile: {
    marginTop: "auto",
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px"
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937"
  },
  userEmail: {
    fontSize: "12px",
    color: "#6b7280"
  }
};

export default Sidebar;