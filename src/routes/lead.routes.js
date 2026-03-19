import express from "express";
import {
  createLead,
  getLeads,
  updateLeadStatus,
  assignLead,
} from "../controllers/lead.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

/* CREATE LEAD */
router.post("/", verifyJWT, createLead);

/* GET ALL LEADS */
router.get("/", verifyJWT, getLeads);

/* UPDATE STATUS */
router.patch("/:id/status", verifyJWT, updateLeadStatus);

/* ASSIGN LEAD */
router.patch("/:id/assign", verifyJWT, assignLead);

export default router;