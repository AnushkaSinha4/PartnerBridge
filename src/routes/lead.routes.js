import express from "express";
import {
    createLead,
    getLeads,
    updateLeadStatus,
    assignLead,
} from "../controllers/lead.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createLead);
router.get("/", verifyJWT, getLeads);
router.patch("/:id/status", verifyJWT, updateLeadStatus);
router.patch("/:id/assign", verifyJWT, assignLead);

export default router;