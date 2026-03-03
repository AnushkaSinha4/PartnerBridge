

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

const AssignTaskModal = ({ isOpen, onClose, onSubmit, projects, users }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    timeEstimate: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", description: "", projectId: "", assignedTo: "", priority: "medium", dueDate: "", timeEstimate: "" });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.projectId) newErrors.projectId = "Project required";
    if (!formData.assignedTo) newErrors.assignedTo = "Assignee required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const taskData = {
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      projectId: formData.projectId,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      timeEstimate: formData.timeEstimate ? Number(formData.timeEstimate) : undefined
    };
    console.log("🚀 SUBMITTING ONE TASK:", taskData);
    try {
      await onSubmit(taskData);
    } catch (error) {
      console.error("❌ Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  if (!isOpen) return null;

  const priorityBadgeColors = {
    low:    "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high:   "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Assign New Task</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create and assign a task to a team member</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={loading}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-gray-50 focus:bg-white
                ${errors.title ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={3}
              disabled={loading}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white resize-vertical transition-colors"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors
                ${errors.projectId ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
            {errors.projectId && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.projectId}
              </p>
            )}
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors
                ${errors.assignedTo ? "border-red-400" : "border-gray-200"}`}
            >
              <option value="">Select Team Member</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.assignedTo}
              </p>
            )}
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Time Estimate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time Estimate (hours)</label>
            <input
              type="number"
              name="timeEstimate"
              value={formData.timeEstimate}
              onChange={handleChange}
              placeholder="e.g., 2.5"
              min="0"
              step="0.5"
              disabled={loading}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          {/* Priority Preview */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-600">
            <span>Selected Priority:</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${priorityBadgeColors[formData.priority]}`}>
              {formData.priority}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;