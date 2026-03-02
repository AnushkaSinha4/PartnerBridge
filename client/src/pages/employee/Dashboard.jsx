import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/v1/tasks/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // adjust according to backend structure
      setTasks(res.data?.data || []);
    } catch (err) {
      setError("Failed to load tasks");
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "20px" }}>
        Employee Dashboard
      </h1>

      <h2 style={{ marginBottom: "20px" }}>My Assigned Tasks</h2>

      {loading && <p>Loading tasks...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && tasks.length === 0 && (
        <p>No tasks assigned</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{task.title}</h3>

            <p style={{ marginBottom: "8px", color: "#6b7280" }}>
              {task.description}
            </p>

            <p>
              <strong>Project:</strong>{" "}
              {task.project?.name || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor:
                    task.status === "completed"
                      ? "#d1fae5"
                      : task.status === "in_progress"
                      ? "#fef3c7"
                      : "#fee2e2",
                }}
              >
                {task.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeDashboard;