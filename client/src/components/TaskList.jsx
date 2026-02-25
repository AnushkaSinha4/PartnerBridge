import { useEffect, useState } from "react";
import axios from "axios";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Assigned To</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.project?.name}</td>
              <td>
                {task.assignedTo?.firstName}{" "}
                {task.assignedTo?.lastName}
              </td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;