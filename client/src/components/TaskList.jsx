


import { useState } from "react";
import { taskAPI } from "../services/api";
import { Calendar, User, FolderOpen, Eye, FileText } from "lucide-react";

const priorityConfig = {
  low:    { cls: "bg-green-100 text-green-700 border border-green-200",   label: "Low" },
  medium: { cls: "bg-yellow-100 text-yellow-700 border border-yellow-200", label: "Medium" },
  high:   { cls: "bg-orange-100 text-orange-700 border border-orange-200", label: "High" },
  urgent: { cls: "bg-red-100 text-red-700 border border-red-200",          label: "Urgent" },
};

const statusConfig = {
  "todo":        { cls: "bg-gray-100 text-gray-700",     label: "To Do" },
  "in-progress": { cls: "bg-blue-100 text-blue-700",     label: "In Progress" },
  "in-review":   { cls: "bg-yellow-100 text-yellow-800", label: "In Review" },
  "completed":   { cls: "bg-green-100 text-green-700",   label: "Completed" },
  "blocked":     { cls: "bg-red-100 text-red-700",       label: "Blocked" },
};

const TaskList = ({ tasks, onViewTask, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setLoading(true);
      await taskAPI.updateTaskStatus(taskId, newStatus);
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl py-16 flex flex-col items-center gap-3 text-gray-400">
        <FileText className="w-10 h-10 text-gray-200" />
        <p className="text-sm font-medium text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
        {tasks.map((task) => {
          const priority = priorityConfig[task.priority] || priorityConfig.medium;
          const status = statusConfig[task.status] || statusConfig.todo;
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

          return (
            <div
              key={task._id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3
                  onClick={() => onViewTask(task._id)}
                  className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors leading-snug"
                >
                  {task.title}
                </h3>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${priority.cls}`}>
                  {priority.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                {task.description || "No description"}
              </p>

              {/* Meta */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FolderOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{task.project?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{task.assignedTo?.firstName || "Unassigned"} {task.assignedTo?.lastName || ""}</span>
                </div>
              </div>

              {/* Status + View */}
              <div className="flex items-center gap-2 mb-3">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  disabled={loading}
                  className={`flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${status.cls}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>

                <button
                  onClick={() => onViewTask(task._id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className={`flex items-center gap-1.5 text-xs pt-3 border-t border-gray-200
                  ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  {isOverdue && <span className="font-semibold ml-auto">Overdue</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;