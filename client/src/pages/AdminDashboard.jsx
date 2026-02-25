import CreateUser from "../components/CreateUser";
import TaskList from "../components/TaskList";

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <CreateUser />
      <TaskList />
    </div>
  );
}

export default AdminDashboard;