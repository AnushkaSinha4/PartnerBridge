// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";

import { Admin } from "../models/admin.model.js";
import { PartnerAccount } from "../models/partnerAccount.model.js";
import { EmployeeAccount } from "../models/employeeAccount.model.js";
import { ClientAccount } from "../models/clientAccount.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        let token;

        // Check cookies
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        // Check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;

            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user in all account collections
        let user =
            await Admin.findById(decodedToken._id) ||
            await PartnerAccount.findById(decodedToken._id) ||
            await EmployeeAccount.findById(decodedToken._id) ||
            await ClientAccount.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        if (user.status !== "active") {
            throw new ApiError(
                403,
                "Your account is not active. Please contact admin."
            );
        }

        req.user = {
            _id: user._id,
            role: user.role || "admin",
            organization: user.organization
        };

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid access token");
        }

        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }

        throw new ApiError(401, error.message || "Invalid access token");
    }
});

/* ================= ROLE AUTHORIZATION ================= */

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(new ApiError(401, "User not authenticated"));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    `Role (${req.user.role}) is not allowed to access this resource`
                )
            );
        }

        next();
    };
};