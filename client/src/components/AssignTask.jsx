
import { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, AlignLeft, FolderOpen, User, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function AssignTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

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
    const res = await axios.get("http://localhost:5000/api/v1/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const employeeUsers = res.data.data.users.filter(
      (user) => user.role === "employee"
    );
    setEmployees(employeeUsers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/v1/tasks",
        { title, description, project, assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task assigned successfully!");
      setTitle("");
      setDescription("");
      setProject("");
      setAssignedTo("");
    } catch (err) {
      toast.error("Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assign Task</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to assign a task to a team member</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <ClipboardList className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-semibold text-gray-900">Task Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  resize-vertical transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors appearance-none disabled:opacity-50"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign To <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                  bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-colors appearance-none disabled:opacity-50"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                text-white text-sm font-medium rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Assign Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignTask;