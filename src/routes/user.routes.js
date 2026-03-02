import express from "express";
import { getAllUsers, createUser, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// GET all users
router.get("/", authorize("admin", "super_admin"), getAllUsers);

// CREATE user
router.post("/", authorize("admin", "super_admin"), createUser);

router.delete("/:id", authorize("admin", "super_admin"), deleteUser);

export default router;