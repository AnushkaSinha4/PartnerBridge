import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckCircle2, Target,
  Users, ArrowRight, Loader2,
} from 'lucide-react';

import ProjectTable from '../../components/ProjectTable.jsx';
import TaskList from '../../components/TaskList.jsx';
import CreateProjectModal from '../../components/CreateProjectModal.jsx';
import AssignTaskModal from '../../components/AssignTaskModal.jsx';

import { projectAPI, taskAPI } from '../../services/api.js'; 
// ❌ userAPI हटाया क्योंकि वह 404 दे रहा था


const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-100' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-100' },
  red: { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' },
};

const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const c = colorMap[color];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.bg} ${c.border}`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value ?? 0}</p>
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-10 flex justify-center items-center">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
);


const Dashboard = () => {

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users] = useState([]); // अभी empty रख रहे हैं
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

      const [projectsRes, tasksRes] = await Promise.all([
        projectAPI.getAllProjects(),
        taskAPI.getAllTasks({ limit: 5 })
      ]);

      console.log("Projects:", projectsRes.data);
      console.log("Tasks:", tasksRes.data);

      const proj =
        projectsRes?.data?.data?.projects ||
        projectsRes?.data?.data ||
        [];

      const tsk =
        tasksRes?.data?.data?.tasks ||
        tasksRes?.data?.data ||
        [];

      // ⭐ Missing lines (important)
      setProjects(proj);
      setTasks(tsk);

      setStats({
        totalProjects: proj.length,
        totalTasks: tsk.length,
        completedTasks: tsk.filter(t => t.status === "completed").length,
        totalUsers: 0
      });

    } catch (error) {

      console.error("Dashboard Error:", error);

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
      alert(error.response?.data?.message || "Failed to create project");
    }
  };


  const handleAssignTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      setShowTaskModal(false);
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign task");
    }
  };


  const handleViewProject = (projectId) => {
    navigate(`/admin/projects/${projectId}`);
  };

  const handleViewTask = (taskId) => {
    navigate(`/admin/tasks/${taskId}`);
  };


  return (

    <>

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back</p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Assign Task
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            + New Project
          </button>

        </div>

      </div>


      <div className="grid grid-cols-4 gap-4 mb-6">

        <StatsCard title="Total Projects" value={stats.totalProjects} icon={LayoutDashboard} color="blue" />
        <StatsCard title="Total Tasks" value={stats.totalTasks} icon={CheckCircle2} color="green" />
        <StatsCard title="Completed Tasks" value={stats.completedTasks} icon={Target} color="yellow" />
        <StatsCard title="Team Members" value={stats.totalUsers} icon={Users} color="red" />

      </div>


      <section className="mb-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Recent Projects</h2>

          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-1 text-sm"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <LoadingCard />
        ) : (
          <ProjectTable
            projects={projects.slice(0, 5)}
            onViewProject={handleViewProject}
            onStatusChange={fetchAllData}
          />
        )}

      </section>


      <section className="mb-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Recent Tasks</h2>

          <button
            onClick={() => navigate('/admin/tasks')}
            className="flex items-center gap-1 text-sm"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <LoadingCard />
        ) : (
          <TaskList
            tasks={tasks}
            onViewTask={handleViewTask}
            onStatusChange={fetchAllData}
          />
        )}

      </section>


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
        users={users}
      />

    </>
  );
};

export default Dashboard;
