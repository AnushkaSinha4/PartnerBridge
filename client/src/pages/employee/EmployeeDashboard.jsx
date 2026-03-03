// import React, { useState, useEffect } from "react";
// import { Card, Badge, Progress, Table, Spinner } from "flowbite-react";
// import { 
//   HiClipboardList,
//   HiCheckCircle,
//   HiClock,
//   HiExclamationCircle,
//   HiFolder,
//   HiCalendar,
//   HiChartBar,
//   HiUserGroup,
//   HiArrowRight
// } from "react-icons/hi";
// import { employeeAPI } from "../../services/employee.api.js";
// import StatsCard from "../../components/common/StatsCard.jsx";
// import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";

// const EmployeeDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await employeeAPI.getDashboard();
//       console.log("Dashboard data:", response.data);
//       setDashboardData(response.data.data);
//     } catch (err) {
//       console.error("Error fetching dashboard:", err);
//       setError("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <EmployeeLayout>
//         <div className="flex justify-center items-center h-64">
//           <Spinner size="xl" />
//         </div>
//       </EmployeeLayout>
//     );
//   }

//   const taskStats = dashboardData?.taskStats || {
//     total: 0,
//     todo: 0,
//     inProgress: 0,
//     completed: 0,
//     overdue: 0
//   };

//   const projectStats = dashboardData?.projectStats || {
//     total: 0,
//     active: 0,
//     completed: 0,
//     onHold: 0
//   };

//   const highPriorityTasks = dashboardData?.highPriorityTasks || [];
//   const upcomingDeadlines = dashboardData?.upcomingDeadlines || [];

//   return (
//     <EmployeeLayout>
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
//         <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatsCard 
//           title="Total Tasks" 
//           value={taskStats.total} 
//           icon={HiClipboardList}
//           color="blue"
//         />
//         <StatsCard 
//           title="Completed" 
//           value={taskStats.completed} 
//           icon={HiCheckCircle}
//           color="green"
//         />
//         <StatsCard 
//           title="In Progress" 
//           value={taskStats.inProgress} 
//           icon={HiClock}
//           color="yellow"
//         />
//         <StatsCard 
//           title="Overdue" 
//           value={taskStats.overdue} 
//           icon={HiExclamationCircle}
//           color="red"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Task Progress */}
//         <Card className="lg:col-span-2">
//           <h5 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <HiChartBar className="text-blue-600" />
//             Task Progress
//           </h5>
          
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Todo</span>
//                 <span className="font-medium">{taskStats.todo} tasks</span>
//               </div>
//               <Progress 
//                 progress={taskStats.total ? (taskStats.todo / taskStats.total) * 100 : 0}
//                 color="gray"
//                 size="lg"
//               />
//             </div>
            
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">In Progress</span>
//                 <span className="font-medium">{taskStats.inProgress} tasks</span>
//               </div>
//               <Progress 
//                 progress={taskStats.total ? (taskStats.inProgress / taskStats.total) * 100 : 0}
//                 color="yellow"
//                 size="lg"
//               />
//             </div>
            
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Completed</span>
//                 <span className="font-medium">{taskStats.completed} tasks</span>
//               </div>
//               <Progress 
//                 progress={taskStats.total ? (taskStats.completed / taskStats.total) * 100 : 0}
//                 color="green"
//                 size="lg"
//               />
//             </div>
//           </div>
//         </Card>

//         {/* Project Overview */}
//         <Card>
//           <h5 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <HiFolder className="text-blue-600" />
//             Project Overview
//           </h5>
          
//           <div className="space-y-4">
//             <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <HiFolder className="text-blue-600" />
//                 <span className="font-medium">Active Projects</span>
//               </div>
//               <Badge color="info" size="sm">{projectStats.active}</Badge>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <HiCheckCircle className="text-green-600" />
//                 <span className="font-medium">Completed</span>
//               </div>
//               <Badge color="success" size="sm">{projectStats.completed}</Badge>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <HiClock className="text-yellow-600" />
//                 <span className="font-medium">On Hold</span>
//               </div>
//               <Badge color="warning" size="sm">{projectStats.onHold}</Badge>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <HiUserGroup className="text-purple-600" />
//                 <span className="font-medium">Total Projects</span>
//               </div>
//               <Badge color="purple" size="sm">{projectStats.total}</Badge>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* High Priority Tasks */}
//       <div className="mb-8">
//         <h5 className="text-xl font-bold mb-4 flex items-center gap-2">
//           <HiExclamationCircle className="text-red-500" />
//           High Priority Tasks
//         </h5>
        
//         {highPriorityTasks.length === 0 ? (
//           <Card className="text-center py-8">
//             <p className="text-gray-500">No high priority tasks</p>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {highPriorityTasks.map(task => (
//               <Card key={task._id} className="border-l-4 border-red-500">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h6 className="font-semibold text-gray-900">{task.title}</h6>
//                     <p className="text-sm text-gray-600 mt-1">{task.project?.name}</p>
//                   </div>
//                   <Badge color="failure">{task.priority}</Badge>
//                 </div>
//                 <div className="flex justify-between items-center mt-3">
//                   <span className="text-xs text-gray-500">
//                     Due: {new Date(task.dueDate).toLocaleDateString()}
//                   </span>
//                   <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
//                     View <HiArrowRight />
//                   </button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Upcoming Deadlines */}
//       <div className="mb-8">
//         <h5 className="text-xl font-bold mb-4 flex items-center gap-2">
//           <HiCalendar className="text-blue-500" />
//           Upcoming Deadlines
//         </h5>
        
//         {upcomingDeadlines.length === 0 ? (
//           <Card className="text-center py-8">
//             <p className="text-gray-500">No upcoming deadlines</p>
//           </Card>
//         ) : (
//           <Table hoverable>
//             <Table.Head>
//               <Table.HeadCell>Task</Table.HeadCell>
//               <Table.HeadCell>Project</Table.HeadCell>
//               <Table.HeadCell>Due Date</Table.HeadCell>
//               <Table.HeadCell>Priority</Table.HeadCell>
//               <Table.HeadCell>Action</Table.HeadCell>
//             </Table.Head>
//             <Table.Body>
//               {upcomingDeadlines.map(deadline => (
//                 <Table.Row key={deadline.id}>
//                   <Table.Cell className="font-medium">{deadline.title}</Table.Cell>
//                   <Table.Cell>{deadline.project}</Table.Cell>
//                   <Table.Cell>{new Date(deadline.dueDate).toLocaleDateString()}</Table.Cell>
//                   <Table.Cell>
//                     <Badge color={deadline.priority === 'high' ? 'failure' : 'warning'}>
//                       {deadline.priority}
//                     </Badge>
//                   </Table.Cell>
//                   <Table.Cell>
//                     <button className="text-blue-600 hover:underline text-sm">
//                       View Details
//                     </button>
//                   </Table.Cell>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table>
//         )}
//       </div>
//     </EmployeeLayout>
//   );
// };

// export default EmployeeDashboard;




import React, { useState, useEffect } from "react";
import { Badge, Progress, Table, Spinner } from "flowbite-react";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle,
  FolderOpen, Calendar, BarChart2, ArrowRight,
  Flag, Activity,
} from "lucide-react";
import { employeeAPI } from "../../services/employee.api.js";
import StatsCard from "../../components/common/StatsCard.jsx";
import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";

const priorityColors = { low: "success", medium: "warning", high: "failure", urgent: "purple" };
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const timeAgo = (d) => {
  const diff = Math.floor((Date.now() - new Date(d)) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <EmployeeLayout>
      <div className="flex justify-center items-center h-64"><Spinner size="xl" color="info" /></div>
    </EmployeeLayout>
  );

  if (error) return (
    <EmployeeLayout>
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <p className="text-gray-600">{error}</p>
        <button onClick={fetchDashboardData} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Retry</button>
      </div>
    </EmployeeLayout>
  );

  const ts = dashboardData?.taskStats || {};
  const ps = dashboardData?.projectStats || {};
  const highPriorityTasks = dashboardData?.highPriorityTasks || [];
  const upcomingDeadlines = dashboardData?.upcomingDeadlines || [];
  const todayTasks = dashboardData?.todayTasks || [];
  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Tasks"  value={ts.total}      icon={ClipboardList} color="blue"   sub={`${ts.overdue || 0} overdue`} />
        <StatsCard title="Completed"    value={ts.completed}  icon={CheckCircle2}  color="green"  sub="tasks done" />
        <StatsCard title="In Progress"  value={ts.inProgress} icon={Clock}         color="yellow" sub="tasks active" />
        <StatsCard title="Overdue"      value={ts.overdue}    icon={AlertTriangle} color="red"    sub="need attention" />
      </div>

      {/* Task Progress + Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <h5 className="text-base font-semibold text-gray-900">Task Progress</h5>
          </div>
          <div className="space-y-4">
            {[
              { label: "To Do",       val: ts.todo,       color: "gray" },
              { label: "In Progress", val: ts.inProgress, color: "blue" },
              { label: "In Review",   val: ts.inReview,   color: "yellow" },
              { label: "Completed",   val: ts.completed,  color: "green" },
              { label: "Blocked",     val: ts.blocked,    color: "red" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{s.label}</span>
                  <span className="font-semibold text-gray-800">{s.val || 0} tasks</span>
                </div>
                <Progress progress={ts.total ? Math.round(((s.val || 0) / ts.total) * 100) : 0} color={s.color} size="md" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <FolderOpen className="w-4 h-4 text-blue-600" />
            <h5 className="text-base font-semibold text-gray-900">Project Overview</h5>
          </div>
          <div className="space-y-3">
            {[
              { label: "Active",    val: ps.active,    bg: "bg-blue-50",   text: "text-blue-700",   badge: "info" },
              { label: "Completed", val: ps.completed, bg: "bg-green-50",  text: "text-green-700",  badge: "success" },
              { label: "On Hold",   val: ps.onHold,    bg: "bg-yellow-50", text: "text-yellow-700", badge: "warning" },
              { label: "Total",     val: ps.total,     bg: "bg-gray-50",   text: "text-gray-700",   badge: "gray" },
            ].map((p) => (
              <div key={p.label} className={`flex items-center justify-between px-4 py-3 ${p.bg} rounded-lg`}>
                <span className={`text-sm font-medium ${p.text}`}>{p.label} Projects</span>
                <Badge color={p.badge} size="sm">{p.val ?? 0}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Tasks + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h5 className="text-base font-semibold text-gray-900">Today's Tasks</h5>
            </div>
            <Badge color="info" size="sm">{todayTasks.length} due</Badge>
          </div>
          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <CheckCircle2 className="w-8 h-8 mb-2 text-green-300" />
              <p className="text-sm">No tasks due today!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayTasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 cursor-pointer" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.project?.name || "—"}</p>
                  </div>
                  <Badge color={priorityColors[task.priority] || "gray"} size="sm">{task.priority}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <Activity className="w-4 h-4 text-green-500" />
            <h5 className="text-base font-semibold text-gray-900">Recent Activity</h5>
          </div>
          {recentActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Activity className="w-8 h-8 mb-2 text-gray-200" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentActivities.map((a) => (
                <div key={a.id} className="px-5 py-3.5 hover:bg-gray-50">
                  <p className="text-sm text-gray-700">{a.action}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">{a.project}</span>
                    <span className="text-xs text-gray-400">{timeAgo(a.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* High Priority Tasks */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="w-4 h-4 text-red-500" />
          <h5 className="text-base font-semibold text-gray-900">High Priority Tasks</h5>
          <Badge color="failure" size="sm">{highPriorityTasks.length}</Badge>
        </div>
        {highPriorityTasks.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-10 flex flex-col items-center text-gray-400">
            <CheckCircle2 className="w-8 h-8 mb-2 text-green-300" />
            <p className="text-sm">No high priority tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highPriorityTasks.map((task) => (
              <div key={task._id} className="bg-white border border-gray-200 border-l-4 border-l-red-500 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h6 className="font-semibold text-gray-900 text-sm">{task.title}</h6>
                  <Badge color={priorityColors[task.priority] || "failure"} size="sm">{task.priority}</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">{task.project?.name || "—"}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-purple-500" />
          <h5 className="text-base font-semibold text-gray-900">Upcoming Deadlines</h5>
          <span className="text-xs text-gray-400">(Next 7 days)</span>
        </div>
        {upcomingDeadlines.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-10 flex flex-col items-center text-gray-400">
            <Calendar className="w-8 h-8 mb-2 text-gray-200" />
            <p className="text-sm">No upcoming deadlines</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Task</Table.HeadCell>
                <Table.HeadCell>Project</Table.HeadCell>
                <Table.HeadCell>Due Date</Table.HeadCell>
                <Table.HeadCell>Priority</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {upcomingDeadlines.map((d) => (
                  <Table.Row key={d.id} className="bg-white">
                    <Table.Cell className="font-medium text-gray-900">{d.title}</Table.Cell>
                    <Table.Cell className="text-gray-600">{d.project}</Table.Cell>
                    <Table.Cell className="text-gray-600">{formatDate(d.dueDate)}</Table.Cell>
                    <Table.Cell><Badge color={priorityColors[d.priority] || "gray"} size="sm">{d.priority}</Badge></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;