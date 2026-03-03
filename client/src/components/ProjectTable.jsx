
import { useState } from "react";
import { projectAPI } from "../services/api";
import { Eye, Link2, FileText, Users } from "lucide-react";

const statusConfig = {
  "in-progress": { bg: "bg-yellow-100 text-yellow-800",  label: "In progress" },
  "completed":   { bg: "bg-green-100 text-green-800",    label: "Completed" },
  "in-review":   { bg: "bg-blue-100 text-blue-800",      label: "In review" },
  "pending":     { bg: "bg-gray-100 text-gray-700",      label: "Pending" },
};

const ProjectTable = ({ projects, onViewProject, onStatusChange }) => {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const filters = [
    { id: "all",         label: "All" },
    { id: "completed",   label: "Completed" },
    { id: "in-progress", label: "In Progress" },
    { id: "in-review",   label: "In Review" },
    { id: "pending",     label: "Pending" },
  ];

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      setLoading(true);
      await projectAPI.updateProject(projectId, { status: newStatus });
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return "0:00";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  };

  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Filters */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
        <span className="text-sm font-medium text-gray-500">Show:</span>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors
                ${filter === f.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Name", "Status", "Users", "Progress", "Preview", "Time Tracking", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProjects.map((project) => {
              const statusCfg = statusConfig[project.status] || statusConfig.pending;
              return (
                <tr key={project._id} className="hover:bg-gray-50 transition-colors group">
                  {/* Name */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onViewProject(project._id)}
                      className="flex items-center gap-3 font-medium text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      {project.name}
                    </button>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project._id, e.target.value)}
                      disabled={loading}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusCfg.bg}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  {/* Users */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {project.users?.slice(0, 3).map((user, i) => (
                        <img
                          key={i}
                          src={`https://ui-avatars.com/api/?name=${user.firstName || "U"}+${user.lastName || ""}&size=28&background=random`}
                          alt={user.firstName}
                          className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                        />
                      ))}
                      {project.users?.length > 3 && (
                        <span className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                          +{project.users.length - 3}
                        </span>
                      )}
                      {(!project.users || project.users.length === 0) && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> None
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Progress */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-8 text-right">{project.progress || 0}%</span>
                    </div>
                  </td>

                  {/* Preview */}
                  <td className="px-5 py-4">
                    {project.previewLink ? (
                      <a
                        href={project.previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Website <Link2 className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>

                  {/* Time Tracking */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatTime(project.stats?.totalTimeSpent || project.timeSpent)}
                    </span>
                    {(project.stats?.totalTimeEstimate || project.timeEstimate) > 0 && (
                      <span className="text-sm text-gray-400">
                        {" "}/ {formatTime(project.stats?.totalTimeEstimate || project.timeEstimate)}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onViewProject(project._id)}
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText className="w-10 h-10 mb-3 text-gray-200" />
            <p className="text-sm font-medium text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTable;