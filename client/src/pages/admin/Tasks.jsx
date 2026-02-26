import { useState } from 'react';
import { taskAPI } from '../services/api';

const TaskList = ({ tasks, onViewTask, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      low: { bg: '#e6f7e6', color: '#2e7d32' },
      medium: { bg: '#fff4e5', color: '#f57c00' },
      high: { bg: '#ffe5e5', color: '#c62828' },
      urgent: { bg: '#ff0000', color: 'white' }
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: { bg: '#f3f4f6', color: '#4b5563' },
      'in-progress': { bg: '#fef3c7', color: '#92400e' },
      'in-review': { bg: '#dbeafe', color: '#1e40af' },
      completed: { bg: '#d1fae5', color: '#065f46' },
      blocked: { bg: '#fee2e2', color: '#991b1b' }
    };
    return colors[status] || colors.todo;
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setLoading(true);
      await taskAPI.updateTaskStatus(taskId, newStatus);
      onStatusChange?.();
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.taskGrid}>
        {tasks.map((task) => (
          <div key={task._id} style={styles.taskCard}>
            <div style={styles.taskHeader}>
              <h3 style={styles.taskTitle} onClick={() => onViewTask(task._id)}>
                {task.title}
              </h3>
              <span style={{
                ...styles.priorityBadge,
                backgroundColor: getPriorityColor(task.priority).bg,
                color: getPriorityColor(task.priority).color
              }}>
                {task.priority}
              </span>
            </div>

            <p style={styles.taskDescription}>
              {task.description || 'No description'}
            </p>

            <div style={styles.taskMeta}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Project:</span>
                <span style={styles.metaValue}>{task.project?.name || 'N/A'}</span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Assigned to:</span>
                <span style={styles.metaValue}>
                  {task.assignedTo?.firstName || 'Unassigned'} {task.assignedTo?.lastName || ''}
                </span>
              </div>
            </div>

            <div style={styles.taskFooter}>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                style={{
                  ...styles.statusSelect,
                  backgroundColor: getStatusColor(task.status).bg,
                  color: getStatusColor(task.status).color
                }}
                disabled={loading}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>

              <button 
                onClick={() => onViewTask(task._id)}
                style={styles.viewBtn}
              >
                View Details
              </button>
            </div>

            {task.dueDate && (
              <div style={styles.dueDate}>
                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div style={styles.noData}>
          <span style={styles.noDataIcon}>📭</span>
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px'
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  taskCard: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    transition: 'transform 0.2s, boxShadow 0.2s',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  taskTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
    cursor: 'pointer'
  },
  priorityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  taskDescription: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  taskMeta: {
    marginBottom: '16px'
  },
  metaItem: {
    display: 'flex',
    marginBottom: '8px',
    fontSize: '13px'
  },
  metaLabel: {
    width: '90px',
    color: '#6b7280'
  },
  metaValue: {
    flex: 1,
    color: '#1f2937',
    fontWeight: '500'
  },
  taskFooter: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px'
  },
  statusSelect: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none'
  },
  viewBtn: {
    padding: '8px 16px',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#374151'
    }
  },
  dueDate: {
    fontSize: '12px',
    color: '#6b7280',
    paddingTop: '12px',
    borderTop: '1px solid #e5e7eb'
  },
  noData: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af'
  },
  noDataIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px'
  }
};

export default TaskList;