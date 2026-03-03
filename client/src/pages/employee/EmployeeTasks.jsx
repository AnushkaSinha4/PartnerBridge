// import React, { useState, useEffect } from "react";
// import { Card, Badge, Spinner, Button, TextInput, Select } from "flowbite-react";
// import { 
//   HiClipboardList,
//   HiSearch,
//   HiFilter,
//   HiRefresh,
//   HiPlus,
//   HiCalendar,
//   HiUser,
//   HiChat,
//   HiPaperClip,
//   HiArrowRight
// } from "react-icons/hi";
// import { employeeAPI } from "../../services/employee.api.js";
// import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";
// import toast from "react-hot-toast";

// const EmployeeTasks = () => {
//   const [tasks, setTasks] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: "",
//     priority: "",
//     search: ""
//   });

//   useEffect(() => {
//     fetchTasks();
//   }, [filters.status, filters.priority]);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const response = await employeeAPI.getMyTasks(filters);
//       setTasks(response.data.data);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//       toast.error("Failed to load tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDragStart = (e, task) => {
//     e.dataTransfer.setData("taskId", task._id);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = async (e, status) => {
//     e.preventDefault();
//     const taskId = e.dataTransfer.getData("taskId");
    
//     try {
//       await employeeAPI.updateTaskStatus(taskId, status);
//       toast.success(`Task moved to ${status}`);
//       fetchTasks();
//     } catch (error) {
//       toast.error("Failed to update task status");
//     }
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       low: "success",
//       medium: "warning",
//       high: "failure",
//       urgent: "purple"
//     };
//     return colors[priority] || "gray";
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       todo: "gray",
//       "in-progress": "blue",
//       "in-review": "yellow",
//       completed: "green",
//       blocked: "failure"
//     };
//     return colors[status] || "gray";
//   };

//   const columns = [
//     { id: "todo", title: "To Do", color: "gray", icon: HiClipboardList },
//     { id: "in-progress", title: "In Progress", color: "blue", icon: HiRefresh },
//     { id: "in-review", title: "In Review", color: "yellow", icon: HiSearch },
//     { id: "completed", title: "Completed", color: "green", icon: HiCheckCircle },
//     { id: "blocked", title: "Blocked", color: "failure", icon: HiExclamationCircle }
//   ];

//   if (loading && !tasks) {
//     return (
//       <EmployeeLayout>
//         <div className="flex justify-center items-center h-64">
//           <Spinner size="xl" />
//         </div>
//       </EmployeeLayout>
//     );
//   }

//   return (
//     <EmployeeLayout>
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
//         <p className="text-gray-600 mt-1">Drag and drop tasks to update status</p>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="md:col-span-2">
//           <TextInput
//             type="text"
//             placeholder="Search tasks..."
//             value={filters.search}
//             onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//             onKeyPress={(e) => e.key === "Enter" && fetchTasks()}
//             icon={HiSearch}
//           />
//         </div>
        
//         <Select
//           value={filters.priority}
//           onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
//           icon={HiFilter}
//         >
//           <option value="">All Priorities</option>
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//           <option value="urgent">Urgent</option>
//         </Select>

//         <Button color="blue" onClick={fetchTasks}>
//           <HiRefresh className="mr-2 h-4 w-4" />
//           Refresh
//         </Button>
//       </div>

//       {/* Priority Counts */}
//       {tasks?.priorityCounts && (
//         <div className="mb-6 flex flex-wrap gap-2">
//           <Badge color="success" className="px-3 py-1">
//             Low: {tasks.priorityCounts.low}
//           </Badge>
//           <Badge color="warning" className="px-3 py-1">
//             Medium: {tasks.priorityCounts.medium}
//           </Badge>
//           <Badge color="failure" className="px-3 py-1">
//             High: {tasks.priorityCounts.high}
//           </Badge>
//           <Badge color="purple" className="px-3 py-1">
//             Urgent: {tasks.priorityCounts.urgent}
//           </Badge>
//         </div>
//       )}

//       {/* Kanban Board */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         {columns.map((column) => (
//           <div
//             key={column.id}
//             className="bg-gray-50 rounded-lg p-4 min-h-[600px]"
//             onDragOver={handleDragOver}
//             onDrop={(e) => handleDrop(e, column.id)}
//           >
//             {/* Column Header */}
//             <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 border-${column.color}-200`}>
//               <column.icon className={`w-5 h-5 text-${column.color}-600`} />
//               <h3 className={`font-semibold text-${column.color}-600`}>
//                 {column.title}
//               </h3>
//               <Badge color={column.color} size="sm" className="ml-auto">
//                 {tasks?.kanbanData[column.id]?.length || 0}
//               </Badge>
//             </div>
            
//             {/* Tasks */}
//             <div className="space-y-3">
//               {tasks?.kanbanData[column.id]?.map((task) => (
//                 <Card
//                   key={task._id}
//                   className="cursor-pointer hover:shadow-lg transition-shadow"
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, task)}
//                 >
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-start">
//                       <h4 className="font-medium text-gray-900">{task.title}</h4>
//                       <Badge color={getPriorityColor(task.priority)} size="sm">
//                         {task.priority}
//                       </Badge>
//                     </div>
                    
//                     <p className="text-sm text-gray-600 line-clamp-2">
//                       {task.description || "No description"}
//                     </p>
                    
//                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                       <HiFolder className="w-3 h-3" />
//                       <span>{task.project?.name}</span>
//                     </div>
                    
//                     <div className="flex justify-between items-center">
//                       {task.dueDate && (
//                         <div className="flex items-center gap-1 text-xs">
//                           <HiCalendar className="w-3 h-3 text-gray-400" />
//                           <span className={new Date(task.dueDate) < new Date() ? "text-red-500" : "text-gray-500"}>
//                             {new Date(task.dueDate).toLocaleDateString()}
//                           </span>
//                         </div>
//                       )}
                      
//                       <div className="flex items-center gap-2">
//                         {task.comments?.length > 0 && (
//                           <div className="flex items-center gap-1 text-xs text-blue-500">
//                             <HiChat className="w-3 h-3" />
//                             <span>{task.comments.length}</span>
//                           </div>
//                         )}
                        
//                         {task.attachments?.length > 0 && (
//                           <div className="flex items-center gap-1 text-xs text-purple-500">
//                             <HiPaperClip className="w-3 h-3" />
//                             <span>{task.attachments.length}</span>
//                           </div>
//                         )}
                        
//                         {task.assignedTo && (
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <HiUser className="w-3 h-3" />
//                             <span>{task.assignedTo.firstName}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
              
//               {tasks?.kanbanData[column.id]?.length === 0 && (
//                 <div className="text-center py-8 text-gray-400 text-sm">
//                   No tasks
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </EmployeeLayout>
//   );
// };

// export default EmployeeTasks;

// // Missing imports add karo
// import { HiCheckCircle, HiExclamationCircle, HiFolder } from "react-icons/hi";


import React, { useState, useEffect } from "react";
import { Badge, Spinner } from "flowbite-react";
import {
  ClipboardList, RefreshCw, Search, CheckCircle2,
  AlertCircle, FolderOpen, Calendar, MessageSquare,
  Paperclip, User, Filter,
} from "lucide-react";
import { employeeAPI } from "../../services/employee.api.js";
import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";
import toast from "react-hot-toast";

const priorityColors = { low: "success", medium: "warning", high: "failure", urgent: "purple" };

const columns = [
  { id: "todo",        title: "To Do",       borderColor: "border-gray-400",   bg: "bg-gray-50",    Icon: ClipboardList },
  { id: "in-progress", title: "In Progress", borderColor: "border-blue-400",   bg: "bg-blue-50",    Icon: RefreshCw },
  { id: "in-review",   title: "In Review",   borderColor: "border-yellow-400", bg: "bg-yellow-50",  Icon: Search },
  { id: "completed",   title: "Completed",   borderColor: "border-green-400",  bg: "bg-green-50",   Icon: CheckCircle2 },
  { id: "blocked",     title: "Blocked",     borderColor: "border-red-400",    bg: "bg-red-50",     Icon: AlertCircle },
];

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });

  useEffect(() => { fetchTasks(); }, [filters.status, filters.priority]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getMyTasks(filters);
      setTasks(response.data.data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, task) => e.dataTransfer.setData("taskId", task._id);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    try {
      await employeeAPI.updateTaskStatus(taskId, status);
      toast.success(`Task moved to ${status}`);
      fetchTasks();
    } catch {
      toast.error("Failed to update task status");
    }
  };

  if (loading && !tasks) return (
    <EmployeeLayout>
      <div className="flex justify-center items-center h-64"><Spinner size="xl" color="info" /></div>
    </EmployeeLayout>
  );

  return (
    <EmployeeLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">Drag and drop tasks to update their status</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && fetchTasks()}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          onClick={fetchTasks}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Priority Counts */}
      {tasks?.priorityCounts && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { label: "Low",    count: tasks.priorityCounts.low,    color: "success" },
            { label: "Medium", count: tasks.priorityCounts.medium, color: "warning" },
            { label: "High",   count: tasks.priorityCounts.high,   color: "failure" },
            { label: "Urgent", count: tasks.priorityCounts.urgent, color: "purple" },
          ].map((p) => (
            <Badge key={p.label} color={p.color} className="px-3 py-1 text-sm">
              {p.label}: {p.count}
            </Badge>
          ))}
          <Badge color="gray" className="px-3 py-1 text-sm ml-auto">
            Total: {tasks.totalTasks}
          </Badge>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = tasks?.kanbanData?.[col.id] || [];
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-64"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-lg border-t-2 ${col.borderColor} ${col.bg} mb-2`}>
                <div className="flex items-center gap-2">
                  <col.Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">{col.title}</span>
                </div>
                <span className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-2.5 min-h-[200px]">
                {colTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md
                      transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h4>
                      <Badge color={priorityColors[task.priority] || "gray"} size="sm">
                        {task.priority}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
                    )}

                    <div className="flex items-center gap-1.5 mb-2">
                      <FolderOpen className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{task.project?.name || "—"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className={new Date(task.dueDate) < new Date() ? "text-red-500" : ""}>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        {task.comments?.length > 0 && (
                          <span className="flex items-center gap-0.5 text-blue-500">
                            <MessageSquare className="w-3 h-3" />{task.comments.length}
                          </span>
                        )}
                        {task.attachments?.length > 0 && (
                          <span className="flex items-center gap-0.5 text-purple-500">
                            <Paperclip className="w-3 h-3" />{task.attachments.length}
                          </span>
                        )}
                        {task.assignedTo && (
                          <span className="flex items-center gap-0.5">
                            <User className="w-3 h-3" />{task.assignedTo.firstName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-400">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTasks;