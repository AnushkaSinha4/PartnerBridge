// src/controllers/project.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ==================== CREATE PROJECT ====================
export const createProject = asyncHandler(async (req, res) => {
    const { name, description, dueDate, startDate, priority, tags, previewLink } = req.body;

    const project = await Project.create({
        name,
        description,
        dueDate,
        startDate,
        priority: priority || "medium",
        tags: tags || [],
        previewLink,
        createdBy: req.user._id,
        organization: req.user.organization,
        status: "pending",
        progress: 0,
        users: [req.user._id] // Add creator to project
    });

    const populatedProject = await Project.findById(project._id)
        .populate("createdBy", "firstName lastName email")
        .populate("users", "firstName lastName email profileImage");

    return res.status(201).json(
        new ApiResponse(201, populatedProject, "Project created successfully")
    );
});

// ==================== GET ALL PROJECTS ====================
export const getAllProjects = asyncHandler(async (req, res) => {
    const { status, search, priority, page = 1, limit = 10 } = req.query;
    
    const query = { organization: req.user.organization };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
        .populate("users", "firstName lastName email profileImage")
        .populate("createdBy", "firstName lastName")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    // Get task stats for each project
    const projectsWithStats = await Promise.all(projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "completed").length;
        const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
        const todoTasks = tasks.filter(t => t.status === "todo").length;
        
        // Calculate total time spent
        const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
        const totalTimeEstimate = tasks.reduce((acc, task) => acc + (task.timeEstimate || 0), 0);

        return {
            ...project.toObject(),
            stats: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                totalTimeSpent,
                totalTimeEstimate
            }
        };
    }));

    const totalProjects = await Project.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            projects: projectsWithStats,
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
        .populate("users", "firstName lastName email profileImage role")
        .populate("createdBy", "firstName lastName email")
        .populate("attachments.uploadedBy", "firstName lastName");

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check organization access
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this project");
    }

    // Get all tasks for this project
    const tasks = await Task.find({ project: id })
        .populate("assignedTo", "firstName lastName email profileImage")
        .populate("assignedBy", "firstName lastName")
        .populate({
            path: "comments",
            populate: {
                path: "createdBy",
                select: "firstName lastName profileImage"
            }
        })
        .sort("-createdAt");

    // Calculate project stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
    const todoTasks = tasks.filter(t => t.status === "todo").length;
    const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
    const totalTimeEstimate = tasks.reduce((acc, task) => acc + (task.timeEstimate || 0), 0);

    // Group tasks by status
    const tasksByStatus = {
        todo: tasks.filter(t => t.status === "todo"),
        "in-progress": tasks.filter(t => t.status === "in-progress"),
        "in-review": tasks.filter(t => t.status === "in-review"),
        completed: tasks.filter(t => t.status === "completed"),
        blocked: tasks.filter(t => t.status === "blocked")
    };

    return res.status(200).json(
        new ApiResponse(200, {
            project,
            tasks,
            tasksByStatus,
            stats: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                totalTimeSpent,
                totalTimeEstimate,
                progress: project.progress
            }
        }, "Project fetched successfully")
    );
});

// ==================== UPDATE PROJECT ====================
export const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check organization access
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this project");
    }

    // If status is being updated to completed, set completedDate
    if (updates.status === "completed" && project.status !== "completed") {
        updates.completedDate = new Date();
    }

    Object.assign(project, updates);
    await project.save();

    const updatedProject = await Project.findById(id)
        .populate("users", "firstName lastName email profileImage")
        .populate("createdBy", "firstName lastName");

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

// ==================== ADD USERS TO PROJECT ====================
export const addUsersToProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userIds } = req.body;

    if (!Array.isArray(userIds)) {
        throw new ApiError(400, "userIds must be an array");
    }

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check organization access
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this project");
    }

    // Verify all users exist and belong to same organization
    const users = await User.find({
        _id: { $in: userIds },
        organization: req.user.organization
    });

    if (users.length !== userIds.length) {
        throw new ApiError(400, "Some users not found or don't belong to your organization");
    }

    // Add unique users
    const existingUserIds = project.users.map(id => id.toString());
    const newUsers = userIds.filter(id => !existingUserIds.includes(id));
    
    project.users = [...project.users, ...newUsers];
    await project.save();

    const updatedProject = await Project.findById(id)
        .populate("users", "firstName lastName email profileImage");

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Users added to project successfully")
    );
});

// ==================== REMOVE USER FROM PROJECT ====================
export const removeUserFromProject = asyncHandler(async (req, res) => {
    const { id, userId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check organization access
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this project");
    }

    // Cannot remove creator
    if (project.createdBy.toString() === userId) {
        throw new ApiError(400, "Cannot remove project creator");
    }

    project.users = project.users.filter(u => u.toString() !== userId);
    await project.save();

    // Also unassign all tasks from this user in this project
    await Task.updateMany(
        { project: id, assignedTo: userId },
        { assignedTo: null }
    );

    return res.status(200).json(
        new ApiResponse(200, project, "User removed from project successfully")
    );
});

// ==================== DELETE PROJECT ====================
export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check organization access
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this project");
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: id });

    // Delete the project
    await project.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

// ==================== UPLOAD PROJECT ATTACHMENT ====================
export const uploadProjectAttachment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { filename, url } = req.body;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    project.attachments.push({
        filename,
        url,
        uploadedBy: req.user._id
    });

    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project.attachments, "Attachment uploaded successfully")
    );
});

// ==================== GET PROJECT STATS ====================
export const getProjectStats = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const tasks = await Task.find({ project: id });
    
    const stats = {
        totalTasks: tasks.length,
        byStatus: {
            todo: tasks.filter(t => t.status === "todo").length,
            "in-progress": tasks.filter(t => t.status === "in-progress").length,
            "in-review": tasks.filter(t => t.status === "in-review").length,
            completed: tasks.filter(t => t.status === "completed").length,
            blocked: tasks.filter(t => t.status === "blocked").length
        },
        byPriority: {
            low: tasks.filter(t => t.priority === "low").length,
            medium: tasks.filter(t => t.priority === "medium").length,
            high: tasks.filter(t => t.priority === "high").length,
            urgent: tasks.filter(t => t.priority === "urgent").length
        },
        byUser: {},
        timeStats: {
            totalTimeSpent: tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0),
            totalTimeEstimate: tasks.reduce((acc, t) => acc + (t.timeEstimate || 0), 0)
        }
    };

    // Tasks by user
    tasks.forEach(task => {
        if (task.assignedTo) {
            const userId = task.assignedTo.toString();
            if (!stats.byUser[userId]) {
                stats.byUser[userId] = { total: 0, completed: 0 };
            }
            stats.byUser[userId].total++;
            if (task.status === "completed") {
                stats.byUser[userId].completed++;
            }
        }
    });

    return res.status(200).json(
        new ApiResponse(200, stats, "Project stats fetched successfully")
    );
});