// client/services/employee.api.js
import API from "./api";

export const employeeAPI = {
    // Dashboard
    getDashboard: () => API.get("/employee/dashboard"),
    getStats: () => API.get("/employee/stats"),

    // Tasks (Kanban)
    getMyTasks: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.priority) params.append("priority", filters.priority);
        if (filters.projectId) params.append("projectId", filters.projectId);
        if (filters.search) params.append("search", filters.search);
        
        const queryString = params.toString();
        return API.get(`/employee/tasks${queryString ? `?${queryString}` : ""}`);
    },
    
    updateTaskStatus: (taskId, status) => 
        API.patch(`/employee/tasks/${taskId}/status`, { status }),

    // Projects
    getMyProjects: (page = 1, limit = 10, status = "") => {
        let url = `/employee/projects?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return API.get(url);
    },
    
    getProjectDetails: (projectId) => 
        API.get(`/employee/projects/${projectId}`),

    // Deliverables
    uploadDeliverable: (projectId, fileData, taskId = null) => {
        const url = taskId 
            ? `/employee/projects/${projectId}/tasks/${taskId}/deliverables`
            : `/employee/projects/${projectId}/deliverables`;
        return API.post(url, fileData);
    }
};