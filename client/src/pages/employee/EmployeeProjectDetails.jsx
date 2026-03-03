// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, Badge, Spinner, Tabs, Table, Button, Progress } from "flowbite-react";
// import { 
//   HiArrowLeft,
//   HiFolder,
//   HiUserGroup,
//   HiClipboardList,
//   HiCalendar,
//   HiChartBar,
//   HiCheckCircle,
//   HiClock,
//   HiUpload
// } from "react-icons/hi";
// import { employeeAPI } from "../../services/employee.api.js";
// import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";
// import toast from "react-hot-toast";

// const EmployeeProjectDetails = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProjectDetails();
//   }, [projectId]);

//   const fetchProjectDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await employeeAPI.getProjectDetails(projectId);
//       setProject(response.data.data);
//     } catch (error) {
//       console.error("Error fetching project details:", error);
//       toast.error("Failed to load project details");
//     } finally {
//       setLoading(false);
//     }
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

//   if (loading) {
//     return (
//       <EmployeeLayout>
//         <div className="flex justify-center items-center h-64">
//           <Spinner size="xl" />
//         </div>
//       </EmployeeLayout>
//     );
//   }

//   if (!project) {
//     return (
//       <EmployeeLayout>
//         <Card className="text-center py-12">
//           <p className="text-gray-500">Project not found</p>
//           <Button color="light" onClick={() => navigate(-1)} className="mt-4">
//             Go Back
//           </Button>
//         </Card>
//       </EmployeeLayout>
//     );
//   }

//   return (
//     <EmployeeLayout>
//       {/* Back Button */}
//       <Button
//         color="light"
//         onClick={() => navigate(-1)}
//         className="mb-6"
//       >
//         <HiArrowLeft className="mr-2 h-4 w-4" />
//         Back to Projects
//       </Button>

//       {/* Project Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">{project.project.name}</h1>
//             <p className="text-gray-600 mt-2">{project.project.description}</p>
//           </div>
//           <Badge color={project.project.status === "active" ? "success" : "gray"} size="lg">
//             {project.project.status}
//           </Badge>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//           <Card>
//             <div className="text-center">
//               <HiClipboardList className="w-8 h-8 text-blue-500 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-blue-600">
//                 {project.taskStats.total}
//               </div>
//               <div className="text-sm text-gray-500">Total Tasks</div>
//             </div>
//           </Card>
          
//           <Card>
//             <div className="text-center">
//               <HiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-green-600">
//                 {project.taskStats.completed}
//               </div>
//               <div className="text-sm text-gray-500">Completed</div>
//             </div>
//           </Card>
          
//           <Card>
//             <div className="text-center">
//               <HiClock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-yellow-600">
//                 {project.taskStats.inProgress}
//               </div>
//               <div className="text-sm text-gray-500">In Progress</div>
//             </div>
//           </Card>
          
//           <Card>
//             <div className="text-center">
//               <HiUserGroup className="w-8 h-8 text-purple-500 mx-auto mb-2" />
//               <div className="text-2xl font-bold text-purple-600">
//                 {project.myTasks.total}
//               </div>
//               <div className="text-sm text-gray-500">My Tasks</div>
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs aria-label="Project tabs" style="underline">
//         {/* Tasks Tab */}
//         <Tabs.Item title="Tasks" icon={HiClipboardList}>
//           <div className="mt-4">
//             {Object.entries(project.tasks).map(([status, tasks]) => (
//               tasks.length > 0 && (
//                 <div key={status} className="mb-6">
//                   <h3 className="font-semibold text-lg mb-3 capitalize flex items-center gap-2">
//                     <Badge color={getStatusColor(status)}>
//                       {status.replace("-", " ")}
//                     </Badge>
//                     <span className="text-sm text-gray-500">({tasks.length})</span>
//                   </h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {tasks.map(task => (
//                       <Card key={task._id} className="hover:shadow-md">
//                         <div className="space-y-3">
//                           <div className="flex justify-between items-start">
//                             <h4 className="font-medium text-gray-900">{task.title}</h4>
//                             <Badge color={getPriorityColor(task.priority)} size="sm">
//                               {task.priority}
//                             </Badge>
//                           </div>
                          
//                           <p className="text-sm text-gray-600">
//                             {task.description || "No description"}
//                           </p>
                          
//                           <div className="flex items-center justify-between text-sm">
//                             <div className="flex items-center gap-1">
//                               <HiUser className="w-4 h-4 text-gray-400" />
//                               <span>{task.assignedTo?.firstName || "Unassigned"}</span>
//                             </div>
                            
//                             {task.dueDate && (
//                               <div className="flex items-center gap-1">
//                                 <HiCalendar className="w-4 h-4 text-gray-400" />
//                                 <span className={new Date(task.dueDate) < new Date() ? "text-red-500" : "text-gray-500"}>
//                                   {new Date(task.dueDate).toLocaleDateString()}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
                          
//                           {task.status === "in-progress" && (
//                             <Button size="xs" color="blue" className="w-full">
//                               Mark Complete
//                             </Button>
//                           )}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         </Tabs.Item>

//         {/* Team Tab */}
//         <Tabs.Item title="Team" icon={HiUserGroup}>
//           <div className="mt-4">
//             <Table>
//               <Table.Head>
//                 <Table.HeadCell>Name</Table.HeadCell>
//                 <Table.HeadCell>Email</Table.HeadCell>
//                 <Table.HeadCell>Role</Table.HeadCell>
//                 <Table.HeadCell>Joined</Table.HeadCell>
//               </Table.Head>
//               <Table.Body>
//                 {project.teamMembers.map((member, idx) => (
//                   <Table.Row key={idx}>
//                     <Table.Cell className="font-medium">
//                       {member.user.firstName} {member.user.lastName}
//                     </Table.Cell>
//                     <Table.Cell>{member.user.email}</Table.Cell>
//                     <Table.Cell>
//                       <Badge color={member.role === "owner" ? "purple" : "info"}>
//                         {member.role}
//                       </Badge>
//                     </Table.Cell>
//                     <Table.Cell>
//                       {new Date(member.joinedAt).toLocaleDateString()}
//                     </Table.Cell>
//                   </Table.Row>
//                 ))}
//               </Table.Body>
//             </Table>
//           </div>
//         </Tabs.Item>

//         {/* Deliverables Tab */}
//         <Tabs.Item title="Deliverables" icon={HiUpload}>
//           <div className="mt-4">
//             <Button color="blue" className="mb-4">
//               <HiUpload className="mr-2 h-4 w-4" />
//               Upload Deliverable
//             </Button>

//             <Table>
//               <Table.Head>
//                 <Table.HeadCell>File Name</Table.HeadCell>
//                 <Table.HeadCell>Uploaded By</Table.HeadCell>
//                 <Table.HeadCell>Date</Table.HeadCell>
//                 <Table.HeadCell>Action</Table.HeadCell>
//               </Table.Head>
//               <Table.Body>
//                 {/* Add deliverables data here */}
//                 <Table.Row>
//                   <Table.Cell colSpan={4} className="text-center text-gray-500 py-8">
//                     No deliverables yet
//                   </Table.Cell>
//                 </Table.Row>
//               </Table.Body>
//             </Table>
//           </div>
//         </Tabs.Item>
//       </Tabs>
//     </EmployeeLayout>
//   );
// };

// // Helper function for priority colors
// const getPriorityColor = (priority) => {
//   const colors = {
//     low: "success",
//     medium: "warning",
//     high: "failure",
//     urgent: "purple"
//   };
//   return colors[priority] || "gray";
// };

// export default EmployeeProjectDetails;

// // Add missing imports
// import { HiUser } from "react-icons/hi";


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge, Spinner, Table } from "flowbite-react";
import {
  ArrowLeft, FolderOpen, Users, ClipboardList,
  Calendar, CheckCircle2, Clock, Upload, User,
  AlertCircle, ChevronLeft,
} from "lucide-react";
import { employeeAPI } from "../../services/employee.api.js";
import EmployeeLayout from "../../components/layout/EmployeeLayout.jsx";
import toast from "react-hot-toast";

const statusColors = { todo: "gray", "in-progress": "blue", "in-review": "warning", completed: "success", blocked: "failure" };
const priorityColors = { low: "success", medium: "warning", high: "failure", urgent: "purple" };
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const TABS = ["Tasks", "Team", "Deliverables"];

const EmployeeProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tasks");

  useEffect(() => { fetchProjectDetails(); }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getProjectDetails(projectId);
      setProject(response.data.data);
    } catch {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <EmployeeLayout>
      <div className="flex justify-center items-center h-64"><Spinner size="xl" color="info" /></div>
    </EmployeeLayout>
  );

  if (!project) return (
    <EmployeeLayout>
      <div className="bg-white border border-gray-200 rounded-xl py-16 flex flex-col items-center gap-3 text-gray-400">
        <AlertCircle className="w-12 h-12 text-gray-200" />
        <p className="text-gray-500 font-medium">Project not found</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
          Go Back
        </button>
      </div>
    </EmployeeLayout>
  );

  const pd = project.project || {};
  const ts = project.taskStats || {};
  const myTasks = project.myTasks || {};
  const teamMembers = project.teamMembers || [];
  const tasksByStatus = project.tasks || {};

  return (
    <EmployeeLayout>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-5"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{pd.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{pd.description || "No description"}</p>
            </div>
          </div>
          <Badge color={pd.status === "active" ? "success" : "gray"} size="sm">
            {pd.status}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "Total Tasks",  val: ts.total,      icon: ClipboardList, color: "text-blue-600",   bg: "bg-blue-50" },
            { label: "Completed",    val: ts.completed,  icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-50" },
            { label: "In Progress",  val: ts.inProgress, icon: Clock,         color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "My Tasks",     val: myTasks.total, icon: User,          color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.val || 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px
                ${activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Tasks Tab */}
          {activeTab === "Tasks" && (
            <div className="space-y-6">
              {Object.entries(tasksByStatus).map(([status, tasks]) =>
                tasks.length > 0 ? (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge color={statusColors[status] || "gray"}>{status.replace("-", " ")}</Badge>
                      <span className="text-sm text-gray-400">({tasks.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tasks.map((task) => (
                        <div key={task._id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                            <Badge color={priorityColors[task.priority] || "gray"} size="sm">{task.priority}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">{task.description || "No description"}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              <span>{task.assignedTo?.firstName || "Unassigned"}</span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className={new Date(task.dueDate) < new Date() ? "text-red-500" : ""}>
                                  {formatDate(task.dueDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
              {Object.values(tasksByStatus).every((arr) => arr.length === 0) && (
                <div className="flex flex-col items-center py-12 text-gray-400">
                  <ClipboardList className="w-10 h-10 mb-2 text-gray-200" />
                  <p className="text-sm">No tasks in this project</p>
                </div>
              )}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "Team" && (
            teamMembers.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-400">
                <Users className="w-10 h-10 mb-2 text-gray-200" />
                <p className="text-sm">No team members found</p>
              </div>
            ) : (
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Role</Table.HeadCell>
                  <Table.HeadCell>Joined</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {teamMembers.map((member, idx) => (
                    <Table.Row key={idx} className="bg-white">
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                            {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-900">
                            {member.user?.firstName} {member.user?.lastName}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-gray-600">{member.user?.email || "—"}</Table.Cell>
                      <Table.Cell>
                        <Badge color={member.role === "owner" ? "purple" : "info"} size="sm">
                          {member.role}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-gray-600 text-sm">
                        {member.joinedAt ? formatDate(member.joinedAt) : "—"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )
          )}

          {/* Deliverables Tab */}
          {activeTab === "Deliverables" && (
            <div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors mb-5">
                <Upload className="w-4 h-4" /> Upload Deliverable
              </button>
              <div className="flex flex-col items-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Upload className="w-10 h-10 mb-2 text-gray-200" />
                <p className="text-sm">No deliverables uploaded yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProjectDetails;