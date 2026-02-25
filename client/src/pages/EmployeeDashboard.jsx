import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);

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

      console.log(res.data); // 🔍 debug

      setTasks(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Project: {task.project?.name}</p>
            <p>Status: {task.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeDashboard;