// src/controllers/project.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ==================== CREATE PROJECT ====================
export const createProject = asyncHandler(async (req, res) => {
    const { name, description, dueDate, priority, previewLink } = req.body;

    console.log("🔍 CREATE PROJECT REQUEST:");
    console.log("Body:", req.body);
    console.log("User:", req.user?._id);
    console.log("User Organization:", req.user?.organization);

    // Validate required fields
    if (!name?.trim()) {
        throw new ApiError(400, "Project name is required");
    }

    // Get organization ID - either from user or find default
    let organizationId = req.user?.organization;
    
    // If user has no organization, try to find a default one
    if (!organizationId) {
        console.log("⚠️ User has no organization, looking for default organization...");
        const Organization = mongoose.model("Organization");
        const defaultOrg = await Organization.findOne({});
        
        if (defaultOrg) {
            organizationId = defaultOrg._id;
            console.log("✅ Using default organization:", organizationId);
        } else {
            // If no organization exists, create one
            console.log("⚠️ No organization found, creating default organization...");
            const Organization = mongoose.model("Organization");
            const newOrg = await Organization.create({
                name: "Default Organization",
                type: "internal",
                status: "active"
            });
            organizationId = newOrg._id;
            console.log("✅ Created default organization:", organizationId);
        }
    }

    // Create project
    const project = await Project.create({
        name: name.trim(),
        description: description?.trim() || "",
        dueDate: dueDate || null,
        priority: priority || "medium",
        previewLink: previewLink?.trim() || "",
        createdBy: req.user._id,
        organization: organizationId,
        members: [{
            user: req.user._id,
            role: "owner"
        }]
    });

    console.log("✅ Project created:", project._id);

    // Populate project data
    await project.populate([
        { path: "createdBy", select: "firstName lastName email" },
        { path: "members.user", select: "firstName lastName email" },
        { path: "organization", select: "name" }
    ]);

    return res.status(201).json(
        new ApiResponse(201, project, "Project created successfully")
    );
});

// ==================== GET ALL PROJECTS ====================
export const getAllProjects = asyncHandler(async (req, res) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by organization if user has one
    if (req.user?.organization) {
        query.organization = req.user.organization;
    } else {
        // If user has no organization, show projects they created or are member of
        query.$or = [
            { createdBy: req.user._id },
            { "members.user": req.user._id }
        ];
    }

    if (status) query.status = status;
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
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
        new ApiResponse(200, {
            projects,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalProjects,
                totalPages: Math.ceil(totalProjects / parseInt(limit))
            }
        }, "Projects fetched successfully")
    );
});

// ==================== GET PROJECT BY ID ====================
export const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id)
        .populate("createdBy", "firstName lastName email")
        .populate("members.user", "firstName lastName email profileImage")
        .populate("organization", "name")
        .populate({
            path: "tasks",
            populate: {
                path: "assignedTo",
                select: "firstName lastName email"
            }
        });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project fetched successfully")
    );
});

// ==================== UPDATE PROJECT ====================
export const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user has permission to update
    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === "admin" || req.user.role?.name === "super_admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You don't have permission to update this project");
    }

    Object.assign(project, updates);
    await project.save();

    await project.populate("createdBy", "firstName lastName email");

    return res.status(200).json(
        new ApiResponse(200, project, "Project updated successfully")
    );
});

// ==================== DELETE PROJECT ====================
export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user has permission to delete
    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === "admin" || req.user.role?.name === "super_admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You don't have permission to delete this project");
    }

    // Delete all tasks associated with this project
    const Task = mongoose.model("Task");
    await Task.deleteMany({ project: id });

    // Delete the project
    await project.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

// ==================== ADD MEMBER TO PROJECT ====================
export const addProjectMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, role = "member" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user is already a member
    const isMember = project.members.some(m => m.user.toString() === userId);
    if (isMember) {
        throw new ApiError(400, "User is already a member of this project");
    }

    project.members.push({
        user: userId,
        role,
        joinedAt: new Date()
    });

    await project.save();

    await project.populate("members.user", "firstName lastName email");

    return res.status(200).json(
        new ApiResponse(200, project, "Member added successfully")
    );
});

// ==================== REMOVE MEMBER FROM PROJECT ====================
export const removeProjectMember = asyncHandler(async (req, res) => {
    const { id, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Cannot remove the owner
    if (project.createdBy.toString() === userId) {
        throw new ApiError(400, "Cannot remove the project owner");
    }

    project.members = project.members.filter(m => m.user.toString() !== userId);
    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project, "Member removed successfully")
    );
});