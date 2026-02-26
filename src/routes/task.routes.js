// src/routes/task.routes.js
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addComment,
    updateTaskTime,
    assignTask,
    getTasksByUser
} from "../controllers/task.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Task CRUD routes
router.route("/")
    .get(getAllTasks)
    .post(authorize("admin", "super_admin", "employee"), createTask);

router.route("/:id")
    .get(getTaskById)
    .put(updateTask)
    .delete(authorize("admin", "super_admin"), deleteTask);

// Task status and time
router.patch("/:id/status", updateTaskStatus);
router.patch("/:id/time", updateTaskTime);
router.patch("/:id/assign", authorize("admin", "super_admin"), assignTask);

// Task comments
router.post("/:id/comments", addComment);

// User tasks
router.get("/user/:userId", getTasksByUser);

export default router;