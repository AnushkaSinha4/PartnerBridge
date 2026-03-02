import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";

/* ================= GET ALL USERS ================= */

export const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select("-password");

    return res.status(200).json(
        new ApiResponse(
            200, { users },
            "Users fetched successfully"
        )
    );
});

/* ================= CREATE USER ================= */

export const createUser = asyncHandler(async(req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        role,
        organizationId,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    let organization = organizationId;

    if (!organization && req.user.role !== "super_admin") {
        organization = req.user.organization;
    }

    if (organization) {
        const orgExists = await Organization.findById(organization);
        if (!orgExists) {
            throw new ApiError(404, "Organization not found");
        }
    }

    const user = await User.create({
        email,
        password: password || "Default@123",
        firstName,
        lastName,
        role,
        organization,
        status: "active",
        createdBy: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201, { user },
            "User created successfully"
        )
    );
});

/* ================= DELETE USER ================= */

export const deleteUser = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully")
    );
});