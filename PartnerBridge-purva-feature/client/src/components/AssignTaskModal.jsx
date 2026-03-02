// src/components/AssignTaskModal.jsx
import { useState, useEffect } from "react";

const AssignTaskModal = ({ isOpen, onClose, onSubmit, projects, users }) => {
  // ✅ SINGLE source of truth
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",  // ✅ ONLY this field
    priority: "medium",
    dueDate: "",
    timeEstimate: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        projectId: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
        timeEstimate: ""
      });
      setErrors({});
    }
  }, [isOpen]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.projectId) newErrors.projectId = "Project required";
    if (!formData.assignedTo) newErrors.assignedTo = "Assignee required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SINGLE submit handler - ONE data object
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // ✅ ONLY create ONE data object
    const taskData = {
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      projectId: formData.projectId,
      assignedTo: formData.assignedTo,  // ✅ CORRECT field name
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      timeEstimate: formData.timeEstimate ? Number(formData.timeEstimate) : undefined
    };

    // ✅ Log ONLY ONCE
    console.log("🚀 SUBMITTING ONE TASK:", taskData);
    
    try {
      await onSubmit(taskData);
      // Parent will close modal on success
    } catch (error) {
      console.error("❌ Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Assign New Task</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        
        <p style={styles.subtitle}>Create and assign a task to team member</p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Title <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              style={{
                ...styles.input,
                borderColor: errors.title ? '#ef4444' : '#e5e7eb'
              }}
              disabled={loading}
            />
            {errors.title && <span style={styles.errorText}>{errors.title}</span>}
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              style={styles.textarea}
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Project */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Project <span style={styles.required}>*</span>
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              style={{
                ...styles.select,
                borderColor: errors.projectId ? '#ef4444' : '#e5e7eb'
              }}
              disabled={loading}
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && <span style={styles.errorText}>{errors.projectId}</span>}
          </div>

          {/* Assign To - ✅ IMPORTANT - name="assignedTo" */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Assign To <span style={styles.required}>*</span>
            </label>
            <select
              name="assignedTo"  // ✅ MUST be "assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              style={{
                ...styles.select,
                borderColor: errors.assignedTo ? '#ef4444' : '#e5e7eb'
              }}
              disabled={loading}
            >
              <option value="">Select Team Member</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
            {errors.assignedTo && <span style={styles.errorText}>{errors.assignedTo}</span>}
          </div>

          {/* Priority and Due Date */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={styles.select}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                style={styles.input}
                min={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
          </div>

          {/* Time Estimate */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Time Estimate (hours)</label>
            <input
              type="number"
              name="timeEstimate"
              value={formData.timeEstimate}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., 2.5"
              min="0"
              step="0.5"
              disabled={loading}
            />
          </div>

          {/* Preview */}
          <div style={styles.preview}>
            <span>Selected Priority: </span>
            <span style={{
              ...styles.priorityBadge,
              backgroundColor: 
                formData.priority === 'low' ? '#e6f7e6' :
                formData.priority === 'medium' ? '#fff4e5' : '#ffe5e5',
              color:
                formData.priority === 'low' ? '#2e7d32' :
                formData.priority === 'medium' ? '#f57c00' : '#c62828'
            }}>
              {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
            </span>
          </div>

          {/* Buttons */}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={loading}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666'
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '16px',
    flex: 1
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '8px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '14px'
  },
  required: {
    color: '#ef4444'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  preview: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    fontSize: '14px'
  },
  priorityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    marginLeft: '8px',
    fontWeight: '500'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px'
  },
  cancelBtn: {
    padding: '10px 16px',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  submitBtn: {
    padding: '10px 16px',
    border: 'none',
    backgroundColor: '#1f2937',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default AssignTaskModal;