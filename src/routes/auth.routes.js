import { Router } from "express";
import {
    sendOtp,
    verifyOtp,
    logout,
    refreshAccessToken,
    getCurrentUser
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

/* ================= PUBLIC ROUTES ================= */

// Register user (admin/client creation etc.)
// router.post("/register", register);

// Send OTP to email
router.post("/send-otp", sendOtp);

// Verify OTP and login
router.post("/verify-otp", verifyOtp);

// Refresh token
router.post("/refresh-token", refreshAccessToken);


/* ================= PROTECTED ROUTES ================= */

// Logout
router.post("/logout", verifyJWT, logout);

// Get current logged in user
router.get("/me", verifyJWT, getCurrentUser);

export default router;