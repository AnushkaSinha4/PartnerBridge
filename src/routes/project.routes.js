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
    addUsersToProject,
    removeUserFromProject,
    uploadProjectAttachment,
    getProjectStats
} from "../controllers/project.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Project CRUD routes
router.route("/")
    .get(getAllProjects)
    .post(authorize("admin", "super_admin"), createProject);

router.route("/:id")
    .get(getProjectById)
    .put(authorize("admin", "super_admin"), updateProject)
    .delete(authorize("admin", "super_admin"), deleteProject);

// Project stats
router.get("/:id/stats", getProjectStats);

// Project users management
router.post("/:id/users", authorize("admin", "super_admin"), addUsersToProject);
router.delete("/:id/users/:userId", authorize("admin", "super_admin"), removeUserFromProject);

// Project attachments
router.post("/:id/attachments", authorize("admin", "super_admin", "employee"), uploadProjectAttachment);

export default router;