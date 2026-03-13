import express from "express";

import {
    submitPartnerForm,
    getPartnerStatus,
    getAllPartners,
    updatePartnerStatus
} from "../controllers/partner.controller.js";

import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ================= PARTNER ROUTES ================= */

// Partner onboarding form submit
router.post(
    "/onboarding",
    verifyJWT,
    authorizeRoles("partner"),
    submitPartnerForm
);

// Partner check onboarding status
router.get(
    "/me",
    verifyJWT,
    authorizeRoles("partner"),
    getPartnerStatus
);


/* ================= ADMIN ROUTES ================= */

// Admin → get all onboarding partners
router.get(
    "/admin/all",
    verifyJWT,
    authorizeRoles("admin", "super_admin"),
    getAllPartners
);

// Admin → approve / reject partner
router.put(
    "/admin/:id/status",
    verifyJWT,
    authorizeRoles("admin", "super_admin"),
    updatePartnerStatus
);

export default router;