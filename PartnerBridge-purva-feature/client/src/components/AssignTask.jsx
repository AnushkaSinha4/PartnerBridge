import { useEffect, useState } from "react";
import axios from "axios";

function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(res.data.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/v1/admin/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const employeeUsers = res.data.data.users.filter(
      (user) => user.role === "employee"
    );

    setEmployees(employeeUsers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/v1/tasks",
      { title, description, project, assignedTo },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Task assigned");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select onChange={(e) => setProject(e.target.value)}>
        <option>Select Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setAssignedTo(e.target.value)}>
        <option>Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.firstName} ({emp.email})
          </option>
        ))}
      </select>

      <button type="submit">Assign Task</button>
    </form>
  );
}

export default AssignTask;