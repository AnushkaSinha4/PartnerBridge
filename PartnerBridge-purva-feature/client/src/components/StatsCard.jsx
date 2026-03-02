const StatsCard = ({ title, value, icon, change, color }) => {
  return (
    <div style={styles.card}>
      <div style={styles.iconWrapper}>
        <span style={styles.icon}>{icon}</span>
      </div>
      <div style={styles.content}>
        <p style={styles.title}>{title}</p>
        <h3 style={styles.value}>{value}</h3>
        {change && (
          <p style={{
            ...styles.change,
            color: change > 0 ? "#10b981" : "#ef4444"
          }}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, boxShadow 0.2s",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px"
  },
  value: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "4px"
  },
  change: {
    fontSize: "12px",
    fontWeight: "500"
  }
};

export default StatsCard;