

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import {
  LayoutDashboard, CheckCircle2, Target,
  Users, ArrowRight, Loader2,
} from 'lucide-react';
// import AdminLayout from '../../components/layout/AdminLayout.jsx';
import ProjectTable from '../../components/ProjectTable.jsx';
import TaskList from '../../components/TaskList.jsx';
import CreateProjectModal from '../../components/CreateProjectModal.jsx';
import AssignTaskModal from '../../components/AssignTaskModal.jsx';
import { projectAPI, taskAPI, userAPI } from '../../services/api.js';

// ── StatsCard ─────────────────────────────────────────────────────────────
const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-100' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-500',    border: 'border-red-100'   },
};

const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const c = colorMap[color];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${c.bg} ${c.border}`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? 0}</p>
      </div>
    </div>
  );
};

// ── Loading placeholder ───────────────────────────────────────────────────
const LoadingCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-10 flex justify-center items-center">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [projects, setProjects]           = useState([]);
  const [tasks, setTasks]                 = useState([]);
  const [users, setUsers]                 = useState([]);
  const [stats, setStats]                 = useState({ totalProjects: 0, totalTasks: 0, completedTasks: 0, totalUsers: 0 });
  const [loading, setLoading]             = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal]       = useState(false);

  const navigate = useNavigate();

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        projectAPI.getAllProjects(),
        taskAPI.getAllTasks({ limit: 5 }),
        userAPI.getAllUsers({ limit: 100 }),
      ]);

      const proj = projectsRes.data.data.projects || projectsRes.data.data || [];
      const tsk  = tasksRes.data.data.tasks       || tasksRes.data.data   || [];
      const usr  = usersRes.data.data.users        || usersRes.data.data   || [];

      setProjects(proj);
      setTasks(tsk);
      setUsers(usr);
      setStats({
        totalProjects:  proj.length,
        totalTasks:     tsk.length,
        completedTasks: tsk.filter(t => t.status === 'completed').length,
        totalUsers:     usr.length,
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

  const handleAssignTask = async (taskData) => {
    try {
      console.log("Creating task with data:", taskData);
      if (!taskData.title || !taskData.projectId || !taskData.assignedTo) {
        alert("Missing required fields!");
        return;
      }
      console.log("All required fields are present. Proceeding to API call...", taskData);
      const response = await taskAPI.createTask(taskData);
      console.log("Task created successfully:", response.data);
      setShowTaskModal(false);
      await fetchAllData();
    } catch (error) {
      console.error('Error assigning task:', error);
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        alert(error.response.data?.message || 'Failed to assign task');
      } else {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleViewProject = (projectId) => navigate(`/admin/projects/${projectId}`);
  const handleViewTask    = (taskId)    => navigate(`/admin/tasks/${taskId}`);

  return (
    
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + Assign Task
          </button>
          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Projects"  value={stats.totalProjects}  icon={LayoutDashboard} color="blue"   />
        <StatsCard title="Total Tasks"     value={stats.totalTasks}     icon={CheckCircle2}    color="green"  />
        <StatsCard title="Completed Tasks" value={stats.completedTasks} icon={Target}          color="yellow" />
        <StatsCard title="Team Members"    value={stats.totalUsers}     icon={Users}           color="red"    />
      </div>

      {/* Recent Projects */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Recent Projects</h2>
          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg
              text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {loading ? <LoadingCard /> : (
          <ProjectTable
            projects={projects.slice(0, 5)}
            onViewProject={handleViewProject}
            onStatusChange={fetchAllData}
          />
        )}
      </section>

      {/* Recent Tasks */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Recent Tasks</h2>
          <button
            onClick={() => navigate('/admin/tasks')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg
              text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {loading ? <LoadingCard /> : (
          <TaskList
            tasks={tasks}
            onViewTask={handleViewTask}
            onStatusChange={fetchAllData}
          />
        )}
      </section>

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
    </>
  );
};

export default Dashboard;
