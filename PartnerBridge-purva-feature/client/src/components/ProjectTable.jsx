import { useState } from 'react';
import { projectAPI } from '../services/api';

const ProjectTable = ({ projects, onViewProject, onStatusChange }) => {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'in-progress', label: 'In progress' },
    { id: 'in-review', label: 'In review' },
    { id: 'pending', label: 'Pending' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'in-progress': { bg: '#fef3c7', color: '#92400e', text: 'In progress' },
      'completed': { bg: '#d1fae5', color: '#065f46', text: 'Completed' },
      'in-review': { bg: '#dbeafe', color: '#1e40af', text: 'In review' },
      'pending': { bg: '#f3f4f6', color: '#4b5563', text: 'Pending' }
    };
    return badges[status] || badges.pending;
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      setLoading(true);
      await projectAPI.updateProject(projectId, { status: newStatus });
      onStatusChange?.();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format time (minutes to hours:minutes)
  const formatTime = (minutes) => {
    if (!minutes) return '0:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

  return (
    <div style={styles.container}>
      {/* Filters */}
      <div style={styles.filters}>
        <span style={styles.filterLabel}>Show:</span>
        <div style={styles.filterButtons}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                ...styles.filterButton,
                backgroundColor: filter === f.id ? '#1f2937' : 'transparent',
                color: filter === f.id ? 'white' : '#374151',
                borderColor: filter === f.id ? '#1f2937' : '#e5e7eb'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>NAME</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>USERS</th>
              <th style={styles.th}>PROGRESS</th>
              <th style={styles.th}>PREVIEW</th>
              <th style={styles.th}>TIME TRACKING</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.projectName} onClick={() => onViewProject(project._id)}>
                    <span style={styles.projectIcon}>📄</span>
                    {project.name}
                  </div>
                </td>
                
                <td style={styles.td}>
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project._id, e.target.value)}
                    style={{
                      ...styles.statusSelect,
                      backgroundColor: getStatusBadge(project.status).bg,
                      color: getStatusBadge(project.status).color
                    }}
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                
                <td style={styles.td}>
                  <div style={styles.users}>
                    {project.users && project.users.slice(0, 3).map((user, i) => (
                      <div key={i} style={styles.userAvatar}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.firstName || 'U'}+${user.lastName || ''}&size=24&background=random`}
                          alt={user.firstName}
                          style={styles.userImage}
                        />
                      </div>
                    ))}
                    {project.users && project.users.length > 3 && (
                      <span style={styles.moreUsers}>+{project.users.length - 3}</span>
                    )}
                  </div>
                </td>
                
                <td style={styles.td}>
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${project.progress || 0}%`
                      }} />
                    </div>
                    <span style={styles.progressText}>{project.progress || 0}%</span>
                  </div>
                </td>
                
                <td style={styles.td}>
                  {project.previewLink ? (
                    <a href={project.previewLink} target="_blank" rel="noopener noreferrer" style={styles.previewLink}>
                      Website 🔗
                    </a>
                  ) : (
                    <span style={styles.noLink}>None</span>
                  )}
                </td>
                
                <td style={styles.td}>
                  <div style={styles.timeTracking}>
                    <span style={styles.timeSpent}>
                      {formatTime(project.stats?.totalTimeSpent || project.timeSpent)}
                    </span>
                    {(project.stats?.totalTimeEstimate || project.timeEstimate) > 0 && (
                      <>
                        <span style={styles.timeSeparator}>/</span>
                        <span style={styles.timeEstimate}>
                          {formatTime(project.stats?.totalTimeEstimate || project.timeEstimate)}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                
                <td style={styles.td}>
                  <button 
                    onClick={() => onViewProject(project._id)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <div style={styles.noData}>
            <span style={styles.noDataIcon}>📭</span>
            <p>No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  filterLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterButton: {
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1f2937'
  },
  tr: {
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f9fafb'
    }
  },
  projectName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  projectIcon: {
    fontSize: '18px'
  },
  statusSelect: {
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    outline: 'none'
  },
  users: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  userImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  moreUsers: {
    marginLeft: '4px',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500'
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '120px'
  },
  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#f3f4f6',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1f2937',
    transition: 'width 0.3s'
  },
  progressText: {
    fontSize: '12px',
    color: '#6b7280',
    minWidth: '40px'
  },
  previewLink: {
    color: '#1f2937',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500'
  },
  noLink: {
    color: '#9ca3af',
    fontSize: '13px'
  },
  timeTracking: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px'
  },
  timeSpent: {
    fontWeight: '500',
    color: '#1f2937'
  },
  timeSeparator: {
    color: '#9ca3af'
  },
  timeEstimate: {
    color: '#6b7280'
  },
  viewBtn: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#e5e7eb'
    }
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

export default ProjectTable;