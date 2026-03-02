// src/controllers/project.controller.js
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

/* ================= CREATE PROJECT ================= */

export const createProject = asyncHandler(async(req, res) => {
    const { name, description, dueDate, priority, previewLink } = req.body;

    if (!name || !name.trim()) {
        throw new ApiError(400, "Project name is required");
    }

    let organizationId = null;

    if (req.user && req.user.organization) {
        organizationId = req.user.organization;
    }

    if (!organizationId) {
        const Organization = mongoose.model("Organization");
        const defaultOrg = await Organization.findOne({});

        if (defaultOrg) {
            organizationId = defaultOrg._id;
        } else {
            const newOrg = await Organization.create({
                name: "Default Organization",
                type: "internal",
                status: "active",
            });
            organizationId = newOrg._id;
        }
    }

    const project = await Project.create({
        name: name.trim(),
        description: description ? description.trim() : "",
        dueDate: dueDate || null,
        priority: priority || "medium",
        previewLink: previewLink ? previewLink.trim() : "",
        createdBy: req.user._id,
        organization: organizationId,
        members: [{
            user: req.user._id,
            role: "owner",
        }, ],
    });

    await project.populate([
        { path: "createdBy", select: "firstName lastName email" },
        { path: "members.user", select: "firstName lastName email" },
        { path: "organization", select: "name" },
    ]);

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

/* ================= GET ALL PROJECTS ================= */

/* ================= GET ALL PROJECTS ================= */

export const getAllProjects = asyncHandler(async(req, res) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // 🔥 FIX: Admin & Super Admin see all projects
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        if (req.user.organization) {
            query.organization = req.user.organization;
        } else {
            query.$or = [
                { createdBy: req.user._id },
                { "members.user": req.user._id },
            ];
        }
    }

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
        .populate("createdBy", "firstName lastName email")
        .populate("members.user", "firstName lastName email")
        .populate("organization", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    const totalProjects = await Project.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(
            200, {
                projects,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalProjects,
                    totalPages: Math.ceil(totalProjects / parseInt(limit)),
                },
            },
            "Projects fetched successfully"
        )
    );
});
/* ================= UPDATE PROJECT ================= */

export const updateProject = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const isOwner =
        project.createdBy.toString() === req.user._id.toString();

    const isAdmin =
        req.user.role === "admin" ||
        req.user.role === "super_admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You don't have permission to update this project");
    }

    Object.assign(project, req.body);
    await project.save();

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project updated successfully"));
});

/* ================= DELETE PROJECT ================= */

export const deleteProject = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const isOwner =
        project.createdBy.toString() === req.user._id.toString();

    const isAdmin =
        req.user.role === "admin" ||
        req.user.role === "super_admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You don't have permission to delete this project");
    }

    const Task = mongoose.model("Task");
    await Task.deleteMany({ project: id });

    await project.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Project deleted successfully"));
});


/* ================= ADD PROJECT MEMBER ================= */

export const addProjectMember = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { userId, role = "member" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const alreadyMember = project.members.some(
        (m) => m.user.toString() === userId
    );

    if (alreadyMember) {
        throw new ApiError(400, "User already a member");
    }

    project.members.push({
        user: userId,
        role,
        joinedAt: new Date(),
    });

    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project, "Member added successfully")
    );
});


/* ================= REMOVE PROJECT MEMBER ================= */

export const removeProjectMember = asyncHandler(async(req, res) => {
    const { id, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    project.members = project.members.filter(
        (m) => m.user.toString() !== userId
    );

    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project, "Member removed successfully")
    );
});

/* ================= GET PROJECT BY ID ================= */

export const getProjectById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id)
        .populate("createdBy", "firstName lastName email")
        .populate("members.user", "firstName lastName email")
        .populate("organization", "name");

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project fetched successfully")
    );
});