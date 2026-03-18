import express from "express";

import {
    submitPartnerForm,
    getPartnerStatus,
    getAllPartners,
    updatePartnerStatus
} from "../controllers/partner.controller.js";

import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import Partner from "../models/partner.model.js";

const router = express.Router();

/* ================= PARTNER ROUTES ================= */

// Partner onboarding form submit
router.post(
    "/onboarding",
    verifyJWT,
    authorizeRoles("partner"),
    upload.fields([
        { name: "aadhaarFront", maxCount: 1 },
        { name: "aadhaarBack", maxCount: 1 },
        { name: "passportPhoto", maxCount: 1 }
    ]),
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

// NEW: GET SINGLE PARTNER (FOR PREVIEW PAGE)
router.get(
    "/admin/:id",
    verifyJWT,
    authorizeRoles("admin", "super_admin"),
    async(req, res) => {
        try {

            const partner = await Partner.findById(req.params.id);
            if (!partner) {
                return res.status(404).json({
                    message: "Partner not found"
                });
            }

            res.json({
                success: true,
                data: partner
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Admin → approve / reject partner
router.put(
    "/admin/:id/status",
    verifyJWT,
    authorizeRoles("admin", "super_admin"),
    updatePartnerStatus
);

export default router;