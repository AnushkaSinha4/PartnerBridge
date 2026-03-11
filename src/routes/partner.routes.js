import express from "express";
import {
    submitPartnerForm,
    getPartnerStatus
} from "../controllers/partner.controller.js";

import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ================= PARTNER ROUTES ================= */

router.post(
    "/onboarding",
    verifyJWT,
    authorizeRoles("partner"),
    submitPartnerForm
);

router.get(
    "/me",
    verifyJWT,
    authorizeRoles("partner"),
    getPartnerStatus
);

export default router;