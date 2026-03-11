// src/routes/admin.routes.js
import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/rbac.middleware.js";
import {
    createPartnerAccount,
    createEmployeeAccount,
    createClientAccount,
    getPartners,
    getEmployees,
    getClients,
    updatePartnerStatus,
    updatePartnerTier,
    verifyPartnerKYC
} from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(verifyJWT);
router.use(isAdmin);

/* ================= CREATE ACCOUNTS ================= */
router.post("/create-partner", createPartnerAccount);
router.post("/create-employee", createEmployeeAccount);
router.post("/create-client", createClientAccount);

/* ================= GET ACCOUNTS ================= */
router.get("/partners", getPartners);
router.get("/employees", getEmployees);
router.get("/clients", getClients);

/* ================= PARTNER MANAGEMENT ================= */
router.patch("/partners/:id/status", updatePartnerStatus);
router.patch("/partners/:id/tier", updatePartnerTier);
router.patch("/partners/:id/kyc", verifyPartnerKYC);

/* ================= PARTNER ONBOARDING APPROVAL ================= */
router.patch("/partners/onboarding/:id/status", updatePartnerStatus);

export default router;