import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/rbac.middleware.js";

const router = Router();

// CREATE TASK
router.post("/", verifyJWT, isAdmin, createTask);

// GET ALL TASKS
router.get("/", verifyJWT, isAdmin, getAllTasks);

export default router;