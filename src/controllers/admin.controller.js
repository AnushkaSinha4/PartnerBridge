// src/controllers/admin.controller.js
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";
import { Organization } from "../models/organization.model.js";
import mongoose from "mongoose";

/* ================= COMMON ORG CHECK FUNCTION ================= */

const checkOrgAccess = (reqUser, targetUser) => {
    if (reqUser.role === "super_admin") return false;

    if (
        reqUser.organization &&
        targetUser.organization &&
        reqUser.organization.toString() !== targetUser.organization.toString()
    ) {
        return true;
    }

    return false;
};

/* ================= GET ALL USERS ================= */

export const getAllUsers = asyncHandler(async(req, res) => {
    const {
        page = 1,
            limit = 10,
            role,
            status,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
    } = req.query;

    const query = {};

    if (req.user.role !== "super_admin" && req.user.organization) {
        query.organization = req.user.organization;
    }

    if (role) query.role = role;
    if (status) query.status = status;

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {
        [sortBy]: sortOrder === "desc" ? -1 : 1
    };

    const users = await User.find(query)
        .populate("organization", "name")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-password -refreshToken");

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(
            200, {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / parseInt(limit)),
                },
            },
            "Users fetched successfully"
        )
    );
});

/* ================= GET USER BY ID ================= */

export const getUserById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(id)
        .populate("organization", "name")
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (checkOrgAccess(req.user, user)) {
        throw new ApiError(403, "Access denied to this user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));
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

    return res
        .status(201)
        .json(new ApiResponse(201, { user }, "User created successfully"));
});

/* ================= UPDATE USER ================= */

export const updateUser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password;
    delete updates._id;
    delete updates.refreshToken;

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (checkOrgAccess(req.user, user)) {
        throw new ApiError(403, "Access denied to this user");
    }

    Object.assign(user, updates);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "User updated successfully"));
});

/* ================= DELETE USER ================= */

export const deleteUser = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot delete your own account");
    }

    if (checkOrgAccess(req.user, user)) {
        throw new ApiError(403, "Access denied to this user");
    }

    user.status = "inactive";
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

/* ================= UPDATE USER STATUS ================= */

export const updateUserStatus = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (checkOrgAccess(req.user, user)) {
        throw new ApiError(403, "Access denied to this user");
    }

    user.status = status;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, { user }, "User status updated successfully")
    );
});

/* ================= GET PARTNERS ================= */

export const getPartners = asyncHandler(async(req, res) => {
    const query = { role: "partner" };

    if (req.user.role !== "super_admin" && req.user.organization) {
        query.organization = req.user.organization;
    }

    const partners = await User.find(query)
        .populate("organization", "name")
        .select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, { partners }, "Partners fetched successfully")
    );
});

/* ================= UPDATE PARTNER TIER ================= */

export const updatePartnerTier = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { partnerTier, commissionRate } = req.body;

    const partner = await User.findOne({ _id: id, role: "partner" });

    if (!partner) {
        throw new ApiError(404, "Partner not found");
    }

    partner.partnerTier = partnerTier;
    if (commissionRate !== undefined) {
        partner.commissionRate = commissionRate;
    }

    await partner.save();

    return res.status(200).json(
        new ApiResponse(200, { partner }, "Partner updated successfully")
    );
});


/* ================= VERIFY PARTNER KYC ================= */

export const verifyPartnerKYC = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { kycStatus } = req.body;

    if (!["verified", "rejected"].includes(kycStatus)) {
        throw new ApiError(400, "Invalid KYC status");
    }

    const partner = await User.findOne({ _id: id, role: "partner" });

    if (!partner) {
        throw new ApiError(404, "Partner not found");
    }

    partner.kycStatus = kycStatus;
    await partner.save();

    return res.status(200).json(
        new ApiResponse(200, { partner }, "KYC updated successfully")
    );
});