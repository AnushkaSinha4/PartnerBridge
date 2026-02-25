import CreateUser from "../components/CreateUser";
import CreateProject from "../components/CreateProject";
import AssignTask from "../components/AssignTask";
import TaskList from "../components/TaskList";

function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <hr />

      <h2>Create User</h2>
      <CreateUser />

      <hr />

      <h2>Create Project</h2>
      <CreateProject />

      <hr />

      <h2>Assign Task</h2>
      <AssignTask />

      <hr />

      <h2>All Tasks</h2>
      <TaskList />
    </div>
  );
}

export default AdminDashboard;