// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, Badge, Spinner, Button, Select, Progress, Table } from "flowbite-react";
// import { 
//   HiFolder,
//   HiCalendar,
//   HiUserGroup,
//   HiChartBar,
//   HiClock,
//   HiCheckCircle,
//   HiEye,
//   HiArrowRight
// } from "react-icons/hi";
// import { employeeAPI } from "../../services/employee.api.js";
// import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";
// import toast from "react-hot-toast";

// const EmployeeProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [viewMode, setViewMode] = useState("grid"); // grid or list
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProjects();
//   }, [statusFilter]);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const response = await employeeAPI.getMyProjects(1, 10, statusFilter);
//       setProjects(response.data.data.projects);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       toast.error("Failed to load projects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       active: "success",
//       completed: "info",
//       "on-hold": "warning",
//       cancelled: "failure"
//     };
//     return colors[status] || "gray";
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

//   if (loading) {
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
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
//           <p className="text-gray-600 mt-1">Projects you are part of</p>
//         </div>
        
//         <div className="flex gap-2">
//           <Button
//             color={viewMode === "grid" ? "blue" : "gray"}
//             onClick={() => setViewMode("grid")}
//             size="sm"
//           >
//             Grid
//           </Button>
//           <Button
//             color={viewMode === "list" ? "blue" : "gray"}
//             onClick={() => setViewMode("list")}
//             size="sm"
//           >
//             List
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 flex gap-4">
//         <Select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="w-48"
//         >
//           <option value="">All Projects</option>
//           <option value="active">Active</option>
//           <option value="completed">Completed</option>
//           <option value="on-hold">On Hold</option>
//         </Select>
        
//         <Button color="blue" onClick={fetchProjects}>
//           Apply Filter
//         </Button>
//       </div>

//       {/* Projects Grid View */}
//       {viewMode === "grid" && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <Card
//               key={project._id}
//               className="hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={() => navigate(`/employee/projects/${project._id}`)}
//             >
//               <div className="space-y-4">
//                 {/* Header */}
//                 <div className="flex justify-between items-start">
//                   <div className="flex items-center gap-2">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <HiFolder className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <h5 className="text-lg font-bold text-gray-900">{project.name}</h5>
//                   </div>
//                   <Badge color={getStatusColor(project.status)}>
//                     {project.status}
//                   </Badge>
//                 </div>

//                 {/* Description */}
//                 <p className="text-sm text-gray-600 line-clamp-2">
//                   {project.description || "No description"}
//                 </p>

//                 {/* Priority & Role */}
//                 <div className="flex items-center gap-2">
//                   <Badge color={getPriorityColor(project.priority)} size="sm">
//                     {project.priority}
//                   </Badge>
//                   <Badge color="info" size="sm">
//                     Role: {project.myRole}
//                   </Badge>
//                 </div>

//                 {/* Progress */}
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">Progress</span>
//                     <span className="font-medium">{project.progress}%</span>
//                   </div>
//                   <Progress
//                     progress={project.progress}
//                     color="blue"
//                     size="lg"
//                   />
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-3 gap-2 text-center">
//                   <div className="p-2 bg-gray-50 rounded">
//                     <div className="font-bold text-blue-600">{project.taskStats?.todo || 0}</div>
//                     <div className="text-xs text-gray-500">Todo</div>
//                   </div>
//                   <div className="p-2 bg-gray-50 rounded">
//                     <div className="font-bold text-yellow-600">{project.taskStats?.inProgress || 0}</div>
//                     <div className="text-xs text-gray-500">In Progress</div>
//                   </div>
//                   <div className="p-2 bg-gray-50 rounded">
//                     <div className="font-bold text-green-600">{project.taskStats?.completed || 0}</div>
//                     <div className="text-xs text-gray-500">Done</div>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-between items-center pt-2 border-t">
//                   {project.dueDate && (
//                     <div className="flex items-center gap-1 text-sm text-gray-500">
//                       <HiCalendar className="w-4 h-4" />
//                       <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
//                     </div>
//                   )}
                  
//                   <Button size="xs" color="light" className="ml-auto">
//                     <HiEye className="w-4 h-4 mr-1" />
//                     View
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Projects List View */}
//       {viewMode === "list" && (
//         <Table hoverable>
//           <Table.Head>
//             <Table.HeadCell>Project Name</Table.HeadCell>
//             <Table.HeadCell>Status</Table.HeadCell>
//             <Table.HeadCell>Priority</Table.HeadCell>
//             <Table.HeadCell>Progress</Table.HeadCell>
//             <Table.HeadCell>Due Date</Table.HeadCell>
//             <Table.HeadCell>My Role</Table.HeadCell>
//             <Table.HeadCell>Actions</Table.HeadCell>
//           </Table.Head>
//           <Table.Body>
//             {projects.map((project) => (
//               <Table.Row key={project._id} className="hover:bg-gray-50 cursor-pointer">
//                 <Table.Cell 
//                   className="font-medium text-gray-900"
//                   onClick={() => navigate(`/employee/projects/${project._id}`)}
//                 >
//                   {project.name}
//                 </Table.Cell>
//                 <Table.Cell>
//                   <Badge color={getStatusColor(project.status)}>
//                     {project.status}
//                   </Badge>
//                 </Table.Cell>
//                 <Table.Cell>
//                   <Badge color={getPriorityColor(project.priority)}>
//                     {project.priority}
//                   </Badge>
//                 </Table.Cell>
//                 <Table.Cell>
//                   <div className="flex items-center gap-2">
//                     <Progress
//                       progress={project.progress}
//                       color="blue"
//                       size="sm"
//                       className="w-24"
//                     />
//                     <span className="text-sm">{project.progress}%</span>
//                   </div>
//                 </Table.Cell>
//                 <Table.Cell>
//                   {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "No date"}
//                 </Table.Cell>
//                 <Table.Cell>
//                   <Badge color="info" size="sm">
//                     {project.myRole}
//                   </Badge>
//                 </Table.Cell>
//                 <Table.Cell>
//                   <Button
//                     size="xs"
//                     color="blue"
//                     onClick={() => navigate(`/employee/projects/${project._id}`)}
//                   >
//                     <HiEye className="w-4 h-4 mr-1" />
//                     View
//                   </Button>
//                 </Table.Cell>
//               </Table.Row>
//             ))}
//           </Table.Body>
//         </Table>
//       )}

//       {projects.length === 0 && (
//         <Card className="text-center py-12">
//           <HiFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-medium text-gray-900 mb-2">No Projects Found</h3>
//           <p className="text-gray-500">You haven't been assigned to any projects yet.</p>
//         </Card>
//       )}
//     </EmployeeLayout>
//   );
// };

// export default EmployeeProjects;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Progress, Spinner, Table } from "flowbite-react";
import {
  FolderOpen, Calendar, LayoutGrid, List, Eye,
  Search, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { employeeAPI } from "../../services/employee.api.js";
import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";
import toast from "react-hot-toast";

const statusColors = { active: "success", completed: "info", "on-hold": "warning", cancelled: "failure" };
const priorityColors = { low: "success", medium: "warning", high: "failure", urgent: "purple" };

const EmployeeProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => { fetchProjects(); }, [statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getMyProjects(1, 10, statusFilter);
      setProjects(response.data.data.projects || []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <EmployeeLayout>
      <div className="flex justify-center items-center h-64"><Spinner size="xl" color="info" /></div>
    </EmployeeLayout>
  );

  return (
    <EmployeeLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Projects you are a member of</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg border transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg border transition-colors ${viewMode === "list" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap items-center gap-3">
        {["", "active", "completed", "on-hold"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
              ${statusFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f === "" ? "All" : f === "on-hold" ? "On Hold" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/employee/projects/${project._id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h5 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {project.name}
                  </h5>
                </div>
                <Badge color={statusColors[project.status] || "gray"} size="sm">{project.status}</Badge>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                {project.description || "No description provided."}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge color={priorityColors[project.priority] || "gray"} size="sm">{project.priority}</Badge>
                <Badge color="info" size="sm">Role: {project.myRole}</Badge>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span className="font-semibold text-gray-700">{project.progress || 0}%</span>
                </div>
                <Progress progress={project.progress || 0} color="blue" size="md" />
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Todo",     val: project.taskStats?.todo,       color: "text-gray-600" },
                  { label: "Active",   val: project.taskStats?.inProgress,  color: "text-blue-600" },
                  { label: "Done",     val: project.taskStats?.completed,   color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className={`text-lg font-bold ${s.color}`}>{s.val || 0}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {project.dueDate ? (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                ) : <span />}
                <button
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium
                    border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/employee/projects/${project._id}`); }}
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Project Name</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Priority</Table.HeadCell>
              <Table.HeadCell>Progress</Table.HeadCell>
              <Table.HeadCell>Tasks</Table.HeadCell>
              <Table.HeadCell>Due Date</Table.HeadCell>
              <Table.HeadCell>My Role</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {projects.map((project) => (
                <Table.Row key={project._id} className="bg-white cursor-pointer hover:bg-gray-50">
                  <Table.Cell
                    className="font-semibold text-gray-900"
                    onClick={() => navigate(`/employee/projects/${project._id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-blue-500" />
                      {project.name}
                    </div>
                  </Table.Cell>
                  <Table.Cell><Badge color={statusColors[project.status] || "gray"} size="sm">{project.status}</Badge></Table.Cell>
                  <Table.Cell><Badge color={priorityColors[project.priority] || "gray"} size="sm">{project.priority}</Badge></Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Progress progress={project.progress || 0} color="blue" size="sm" className="w-20" />
                      <span className="text-sm text-gray-600 whitespace-nowrap">{project.progress || 0}%</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-600">
                      <span className="font-semibold text-green-600">{project.taskStats?.completed || 0}</span>
                      /{project.taskStats?.total || 0}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-gray-600 text-sm">
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "—"}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="info" size="sm">{project.myRole}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => navigate(`/employee/projects/${project._id}`)}
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium
                        border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl py-16 flex flex-col items-center gap-3 text-gray-400">
          <FolderOpen className="w-12 h-12 text-gray-200" />
          <h3 className="text-lg font-medium text-gray-500">No Projects Found</h3>
          <p className="text-sm">You haven't been assigned to any projects yet.</p>
        </div>
      )}
    </EmployeeLayout>
  );
};

export default EmployeeProjects;