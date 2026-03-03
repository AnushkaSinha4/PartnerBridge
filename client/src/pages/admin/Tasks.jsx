

import { useState } from 'react';
import { CalendarDays, User, Briefcase, Eye, AlertTriangle, Inbox } from 'lucide-react';
import { taskAPI } from '../services/api';

const TaskList = ({ tasks, onViewTask, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  const getPriorityStyle = (priority) => {
    const map = {
      low:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
      medium: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
      high:   { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
      urgent: { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
    };
    return map[priority] || map.medium;
  };

  const getStatusStyle = (status) => {
    const map = {
      'todo':        { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
      'in-progress': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
      'in-review':   { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
      'completed':   { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
      'blocked':     { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
    };
    return map[status] || map['todo'];
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

  if (tasks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIconWrap}>
          <Inbox size={32} color="#9ca3af" />
        </div>
        <p style={styles.emptyText}>No tasks found</p>
        <p style={styles.emptySubText}>Tasks assigned to you will appear here.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <style>{`
        .task-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.09) !important;
          transform: translateY(-1px);
        }
        .view-btn:hover {
          background-color: #1d4ed8 !important;
        }
        .status-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px #bfdbfe;
        }
      `}</style>

      <div style={styles.taskGrid}>
        {tasks.map((task) => {
          const priorityStyle = getPriorityStyle(task.priority);
          const statusStyle   = getStatusStyle(task.status);

          return (
            <div key={task._id} className="task-card" style={styles.taskCard}>
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <h3
                  style={styles.taskTitle}
                  onClick={() => onViewTask(task._id)}
                  title={task.title}
                >
                  {task.title}
                </h3>
                <span style={{
                  ...styles.badge,
                  backgroundColor: priorityStyle.bg,
                  color: priorityStyle.color,
                  border: `1px solid ${priorityStyle.border}`,
                }}>
                  {task.priority === 'urgent' && <AlertTriangle size={10} style={{ marginRight: '3px' }} />}
                  {task.priority}
                </span>
              </div>

              {/* Description */}
              <p style={styles.description}>
                {task.description || 'No description provided.'}
              </p>

              {/* Meta */}
              <div style={styles.meta}>
                <div style={styles.metaRow}>
                  <Briefcase size={13} color="#9ca3af" />
                  <span style={styles.metaLabel}>Project</span>
                  <span style={styles.metaValue}>{task.project?.name || 'N/A'}</span>
                </div>
                <div style={styles.metaRow}>
                  <User size={13} color="#9ca3af" />
                  <span style={styles.metaLabel}>Assigned</span>
                  <span style={styles.metaValue}>
                    {task.assignedTo
                      ? `${task.assignedTo.firstName || ''} ${task.assignedTo.lastName || ''}`.trim() || 'Unassigned'
                      : 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={styles.divider} />

              {/* Footer */}
              <div style={styles.footer}>
                <select
                  className="status-select"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  disabled={loading}
                  style={{
                    ...styles.statusSelect,
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                  }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>

                <button
                  className="view-btn"
                  onClick={() => onViewTask(task._id)}
                  style={styles.viewBtn}
                >
                  <Eye size={14} style={{ marginRight: '5px' }} />
                  Details
                </button>
              </div>

              {/* Due date */}
              {task.dueDate && (
                <div style={styles.dueDate}>
                  <CalendarDays size={13} color="#6b7280" />
                  <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '18px',
  },
  taskCard: {
    padding: '18px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    transition: 'box-shadow 0.2s, transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '10px',
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
    cursor: 'pointer',
    lineHeight: '1.4',
    flex: 1,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 9px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '14px',
    lineHeight: '1.55',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    marginBottom: '14px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
  },
  metaLabel: {
    color: '#9ca3af',
    width: '54px',
    flexShrink: 0,
  },
  metaValue: {
    color: '#374151',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '0 0 14px',
  },
  footer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '12px',
  },
  statusSelect: {
    flex: 1,
    padding: '7px 10px',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    textAlign: 'center',
    transition: 'box-shadow 0.15s',
  },
  viewBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 13px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    whiteSpace: 'nowrap',
  },
  dueDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '60px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyIconWrap: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 4px',
  },
  emptySubText: {
    fontSize: '13px',
    color: '#9ca3af',
    margin: 0,
  },
};

export default TaskList;