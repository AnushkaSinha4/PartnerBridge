// src/controllers/admin.controller.js
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";

import { Admin } from "../models/admin.model.js";
import { PartnerAccount } from "../models/partnerAccount.model.js";
import { EmployeeAccount } from "../models/employeeAccount.model.js";
import { ClientAccount } from "../models/clientAccount.model.js";

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

/* ================= CREATE PARTNER ACCOUNT ================= */
export const createPartnerAccount = asyncHandler(async(req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const existing = await PartnerAccount.findOne({ email });
    if (existing) {
        throw new ApiError(409, "Partner already exists");
    }
    const partner = await PartnerAccount.create({
        email: email.toLowerCase().trim(),
        status: "active",
        createdBy: req.user._id
    });
    return res.status(201).json(
        new ApiResponse(201, { partner }, "Partner account created"));
});

/* ================= CREATE EMPLOYEE ACCOUNT ================= */
export const createEmployeeAccount = asyncHandler(async(req, res) => {
    const { email } = req.body;

    if (!email) { throw new ApiError(400, "Email is required"); }

    const existing = await EmployeeAccount.findOne({ email });
    if (existing) {
        throw new ApiError(409, "Employee already exists");
    }
    const employee = await EmployeeAccount.create({
        email: email.toLowerCase().trim(),
        status: "active",
        createdBy: req.user._id
    });
    return res.status(201).json(
        new ApiResponse(201, { employee }, "Employee account created"));
});

/* ================= CREATE CLIENT ACCOUNT ================= */
export const createClientAccount = asyncHandler(async(req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const existing = await ClientAccount.findOne({ email });
    if (existing) {
        throw new ApiError(409, "Client already exists");
    }
    const client = await ClientAccount.create({
        email: email.toLowerCase().trim(),
        status: "active",
        createdBy: req.user._id
    });
    return res.status(201).json(
        new ApiResponse(201, { client }, "Client account created"));
});

/* ================= GET PARTNERS ================= */
export const getPartners = asyncHandler(async(req, res) => {
    const partners = await PartnerAccount.find().select("-refreshToken");
    return res.status(200).json(
        new ApiResponse(200, { partners }, "Partners fetched successfully")
    );
});

/* ================= GET EMPLOYEES ================= */
export const getEmployees = asyncHandler(async(req, res) => {
    const employees = await EmployeeAccount.find().select("-refreshToken");
    return res.status(200).json(
        new ApiResponse(200, { employees }, "Employees fetched successfully"));
});

/* ================= GET CLIENTS ================= */
export const getClients = asyncHandler(async(req, res) => {
    const clients = await ClientAccount.find().select("-refreshToken");
    return res.status(200).json(
        new ApiResponse(200, { clients }, "Clients fetched successfully"));
});

/* ================= UPDATE PARTNER STATUS ================= */
export const updatePartnerStatus = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }
    const partner = await PartnerAccount.findById(id);
    if (!partner) {
        throw new ApiError(404, "Partner not found");
    }
    partner.status = status;
    await partner.save();
    return res.status(200).json(new ApiResponse(200, { partner }, "Partner status updated"));
});

/* ================= UPDATE PARTNER TIER ================= */
export const updatePartnerTier = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { partnerTier, commissionRate } = req.body;
    const partner = await PartnerAccount.findById(id);

    if (!partner) {
        throw new ApiError(404, "Partner not found");
    }
    partner.partnerTier = partnerTier;
    if (commissionRate !== undefined) {
        partner.commissionRate = commissionRate;
    }
    await partner.save();
    return res.status(200).json(
        new ApiResponse(200, { partner }, "Partner updated successfully"));
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