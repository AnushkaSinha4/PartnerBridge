// src/routes/project.routes.js
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember
} from "../controllers/project.controller.js";

const router = Router();

// All project routes require authentication
router.use(verifyJWT);

// ==================== PROJECT CRUD ROUTES ====================

/**
 * @route   GET /api/v1/projects
 * @desc    Get all projects (with filters and pagination)
 * @access  Private (All authenticated users)
 */
router.get("/", getAllProjects);

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private (Admin, Super Admin, Employee, Project Manager)
 */
router.post(
    "/", 
    authorize("admin", "super_admin", "employee", "project_manager"), 
    createProject
);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private (All authenticated users with access)
 */
router.get("/:id", getProjectById);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private (Owner, Admin, Super Admin)
 */
router.put(
    "/:id", 
    authorize("admin", "super_admin", "project_manager"), 
    updateProject
);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project
 * @access  Private (Owner, Admin, Super Admin)
 */
router.delete(
    "/:id", 
    authorize("admin", "super_admin"), 
    deleteProject
);

// ==================== PROJECT MEMBER MANAGEMENT ROUTES ====================

/**
 * @route   POST /api/v1/projects/:id/members
 * @desc    Add member to project
 * @access  Private (Owner, Admin, Super Admin, Project Manager)
 */
router.post(
    "/:id/members", 
    authorize("admin", "super_admin", "project_manager"), 
    addProjectMember
);

/**
 * @route   DELETE /api/v1/projects/:id/members/:userId
 * @desc    Remove member from project
 * @access  Private (Owner, Admin, Super Admin, Project Manager)
 */
router.delete(
    "/:id/members/:userId", 
    authorize("admin", "super_admin", "project_manager"), 
    removeProjectMember
);

// ==================== PROJECT TASK MANAGEMENT ROUTES ====================

/**
 * @route   GET /api/v1/projects/:id/tasks
 * @desc    Get all tasks for a project
 * @access  Private (All authenticated users with access)
 */
router.get("/:id/tasks", (req, res) => {
    // This will redirect to tasks controller with project filter
    req.query.projectId = req.params.id;
    // You'll need to import and use getAllTasks from task.controller
    // For now, you can redirect or handle here
    res.redirect(`/api/v1/tasks?projectId=${req.params.id}`);
});

export default router;