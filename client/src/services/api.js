// src/services/api.js
import axios from "axios";

// ===== API CONFIGURATION =====
const API_BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // For cookies
});

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
    (config) => {
        // Add token to every request
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle session expiry
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// ===== AUTH APIS =====
export const authAPI = {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
    getCurrentUser: () => api.get("/auth/me"),
};

// ===== USER APIS =====
export const userAPI = {
    getAllUsers: (params) => api.get("/admin/users", { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    createUser: (data) => api.post("/admin/users", data),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
};

// ===== PARTNER APIS =====
export const partnerAPI = {

    // CREATE PARTNER ACCOUNT (ADMIN)
    createPartner: (data) =>
        api.post("/admin/create-partner", data),

    // GET ALL PARTNERS
    getAllPartners: (params) =>
        api.get("/admin/partners", { params }),

    // UPDATE PARTNER TIER
    updateTier: (id, tier, commissionRate) =>
        api.patch(`/admin/partners/${id}/tier`, { tier, commissionRate }),

    // VERIFY PARTNER KYC
    verifyKYC: (id, status, remarks) =>
        api.patch(`/admin/partners/${id}/kyc`, { status, remarks }),
};


// ===== PROJECT APIS =====
export const projectAPI = {
    // Get all projects
    getAllProjects: (params) => api.get("/projects", { params }),

    // Get single project by ID
    getProjectById: (id) => api.get(`/projects/${id}`),

    // Create new project
    createProject: (data) => api.post("/projects", data),

    // Update project
    updateProject: (id, data) => api.put(`/projects/${id}`, data),

    // Delete project
    deleteProject: (id) => api.delete(`/projects/${id}`),

    // Add users to project
    addUsersToProject: (id, userIds) => api.post(`/projects/${id}/users`, { userIds }),

    // Remove user from project
    removeUserFromProject: (id, userId) => api.delete(`/projects/${id}/users/${userId}`),

    // Get project stats
    getProjectStats: (id) => api.get(`/projects/${id}/stats`),

    // Upload attachment
    uploadAttachment: (id, data) => api.post(`/projects/${id}/attachments`, data),
};

// ========== TASK APIS (ADD THESE) ==========
export const taskAPI = {
    // Get all tasks
    getAllTasks: (params) => api.get("/tasks", { params }),

    // Get single task by ID
    getTaskById: (id) => api.get(`/tasks/${id}`),

    // Create new task
    createTask: (data) => {
        console.log("🚀 API Call with data:", data); // Debug log
        return api.post("/tasks", data);
    },

    // Update task
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),

    // Delete task
    deleteTask: (id) => api.delete(`/tasks/${id}`),

    // Update task status
    updateTaskStatus: (id, status, timeSpent) =>
        api.patch(`/tasks/${id}/status`, { status, timeSpent }),

    // Update task time
    updateTaskTime: (id, timeSpent) => api.patch(`/tasks/${id}/time`, { timeSpent }),

    // Assign task to user
    assignTask: (id, userId) => api.patch(`/tasks/${id}/assign`, { userId }),

    // Add comment to task
    addComment: (id, content, mentions) =>
        api.post(`/tasks/${id}/comments`, { content, mentions }),

    // Get tasks by user
    getTasksByUser: (userId, params) => api.get(`/tasks/user/${userId}`, { params }),
};

// ===== EMPLOYEE APIS (ADD AT THE END OF FILE) =====
export const employeeAPI = {
        // Dashboard
        getDashboard: () => api.get("/employee/dashboard"),
        getStats: () => api.get("/employee/stats"),

        // Tasks (Kanban)
        getMyTasks: (filters = {}) => {
                const params = new URLSearchParams();
                if (filters.status) params.append("status", filters.status);
                if (filters.priority) params.append("priority", filters.priority);
                if (filters.projectId) params.append("projectId", filters.projectId);
                if (filters.search) params.append("search", filters.search);

                const queryString = params.toString();
                return api.get(`/employee/tasks${queryString ? `?${queryString}` : ""}`);
  },
  
  updateTaskStatus: (taskId, status) => 
    api.patch(`/employee/tasks/${taskId}/status`, { status }),

  // Projects
  getMyProjects: (page = 1, limit = 10, status = "") => {
    let url = `/employee/projects?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },
  
  getProjectDetails: (projectId) => 
    api.get(`/employee/projects/${projectId}`),

  // Deliverables
  uploadDeliverable: (projectId, fileData, taskId = null) => {
    const url = taskId 
      ? `/employee/projects/${projectId}/tasks/${taskId}/deliverables`
      : `/employee/projects/${projectId}/deliverables`;
    return api.post(url, fileData);
  }
};

// ===== PARTNER ONBOARDING =====

export const partnerOnboardingAPI = {

  submitForm: (data) =>
    api.post("/partners/onboarding", data),

  getStatus: () =>
    api.get("/partners/me")

};

export default api;