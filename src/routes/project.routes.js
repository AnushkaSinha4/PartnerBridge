import { Router } from "express";
import {
    createProject,
    getAllProjects,
} from "../controllers/project.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/rbac.middleware.js";

const router = Router();

/* ================= ADMIN PROJECT ROUTES ================= */

router.post("/", verifyJWT, isAdmin, createProject);
router.get("/", verifyJWT, isAdmin, getAllProjects);

export default router;