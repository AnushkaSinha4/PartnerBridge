import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar.jsx';
import Header from '../../components/Header.jsx';
import ProjectTable from '../../components/ProjectTable.jsx';
import TaskList from '../../components/TaskList.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import CreateProjectModal from '../../components/CreateProjectModal.jsx';
import AssignTaskModal from '../../components/AssignTaskModal.jsx';
import { projectAPI, taskAPI, userAPI } from '../../services/api.js';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        projectAPI.getAllProjects(),
        taskAPI.getAllTasks({ limit: 5 }),
        userAPI.getAllUsers({ limit: 100 })
      ]);

      setProjects(projectsRes.data.data.projects || projectsRes.data.data || []);
      setTasks(tasksRes.data.data.tasks || tasksRes.data.data || []);
      setUsers(usersRes.data.data.users || usersRes.data.data || []);

      // Calculate stats
      const allTasks = tasksRes.data.data.tasks || tasksRes.data.data || [];
      setStats({
        totalProjects: projectsRes.data.data.projects?.length || projectsRes.data.data?.length || 0,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'completed').length,
        totalUsers: usersRes.data.data.users?.length || usersRes.data.data?.length || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await projectAPI.createProject(projectData);
      setShowProjectModal(false);
      fetchAllData();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    }
  };

 // src/pages/admin/Dashboard.jsx
const handleAssignTask = async (taskData) => {
  try {
    console.log("Creating task with data:", taskData);
    
    // ✅ Verify all required fields
    if (!taskData.title || !taskData.projectId || !taskData.assignedTo) {
      alert("Missing required fields!");
      return;
    }

    console.log("All required fields are present. Proceeding to API call...",taskData);

    // ✅ Make API call
    const response = await taskAPI.createTask(taskData);
    console.log("Task created successfully:", response.data);
    
    setShowTaskModal(false);
    await fetchAllData(); // Refresh data
    
  } catch (error) {
    console.error('Error assigning task:', error);
    
    // ✅ Show detailed error
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
      alert(error.response.data?.message || 'Failed to assign task');
    } else {
      alert('Network error. Please try again.');
    }
  }
};

  const handleViewProject = (projectId) => {
    navigate(`/admin/projects/${projectId}`);
  };

  const handleViewTask = (taskId) => {
    navigate(`/admin/tasks/${taskId}`);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <Header 
          title="Dashboard" 
          onAddProject={() => setShowProjectModal(true)}
          onAddTask={() => setShowTaskModal(true)}
        />

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <StatsCard 
            title="Total Projects"
            value={stats.totalProjects}
            icon="📊"
          />
          <StatsCard 
            title="Total Tasks"
            value={stats.totalTasks}
            icon="✅"
          />
          <StatsCard 
            title="Completed Tasks"
            value={stats.completedTasks}
            icon="🎯"
          />
          <StatsCard 
            title="Team Members"
            value={stats.totalUsers}
            icon="👥"
          />
        </div>

        {/* Recent Projects */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Projects</h2>
            <button 
              onClick={() => navigate('/admin/projects')}
              style={styles.viewAllBtn}
            >
              View All →
            </button>
          </div>
          
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
            </div>
          ) : (
            <ProjectTable 
              projects={projects.slice(0, 5)}
              onViewProject={handleViewProject}
              onStatusChange={fetchAllData}
            />
          )}
        </div>

        {/* Recent Tasks */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Tasks</h2>
            <button 
              onClick={() => navigate('/admin/tasks')}
              style={styles.viewAllBtn}
            >
              View All →
            </button>
          </div>
          
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
            </div>
          ) : (
            <TaskList 
              tasks={tasks}
              onViewTask={handleViewTask}
              onStatusChange={fetchAllData}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleCreateProject}
      />

      <AssignTaskModal 
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleAssignTask}
        projects={projects}
        users={users.filter(u => u.role === 'employee')}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  mainContent: {
    flex: 1,
    marginLeft: '280px',
    padding: '0 30px 30px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  section: {
    marginBottom: '30px'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  viewAllBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#6b7280',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f9fafb',
      color: '#111827'
    }
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #1f2937',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default Dashboard;