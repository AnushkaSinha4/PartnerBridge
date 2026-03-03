// src/routes/employee.routes.js
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import {
    getEmployeeDashboard,
    getMyTasks,
    updateMyTaskStatus,
    getMyProjects,
    getMyProjectDetails,
    uploadDeliverable,
    getMyStats
} from "../controllers/employee.controller.js";

const router = Router();

// All employee routes require authentication and employee role
router.use(verifyJWT);
router.use(authorize("employee", "admin", "super_admin"));

// Dashboard
router.get("/dashboard", getEmployeeDashboard);
router.get("/stats", getMyStats);

// Tasks (Kanban)
router.get("/tasks", getMyTasks);
router.patch("/tasks/:id/status", updateMyTaskStatus);

// Projects
router.get("/projects", getMyProjects);
router.get("/projects/:projectId", getMyProjectDetails);

// Deliverables
router.post("/projects/:projectId/deliverables", uploadDeliverable);
router.post("/projects/:projectId/tasks/:taskId/deliverables", uploadDeliverable);

export default router;