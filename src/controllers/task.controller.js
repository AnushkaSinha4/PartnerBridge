// src/controllers/task.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ==================== CREATE TASK ====================
export const createTask = asyncHandler(async (req, res) => {
    const { 
        title, 
        description, 
        projectId, 
        assignedTo, 
        priority, 
        dueDate, 
        timeEstimate,
        tags 
    } = req.body;

    console.log("🔍 CREATE TASK REQUEST:");
    console.log("Body:", req.body);
    console.log("User:", req.user._id);
    console.log("User Organization:", req.user.organization);

    console.log("🔍 Checking Project:", projectId);

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
         console.log("❌ Project NOT FOUND in database!");
        console.log("Searched for ID:", projectId);
        throw new ApiError(404, "Project not found");
    }

    if (project.organization.toString() !== req.user.organization.toString()) {
         console.log("❌ Organization MISMATCH!");
        throw new ApiError(403, "Access denied to this project");
    }

    // Check if assigned user exists and belongs to organization
       console.log("🔍 Checking User:", assignedTo);
    if (assignedTo) {
        const assignedUser = await User.findOne({
            _id: assignedTo,
            organization: req.user.organization
        });
        if (!assignedUser) {
             console.log("❌ User NOT FOUND in database!");
            console.log("Searched for ID:", assignedTo);
            throw new ApiError(404, "Assigned user not found");
        }
    }
     console.log("🔍 Creating task...");

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo,
        assignedBy: req.user._id,
        priority: priority || "medium",
        dueDate,
        timeEstimate,
        tags: tags || [],
        status: "todo"
    });

    const populatedTask = await Task.findById(task._id)
        .populate("assignedTo", "firstName lastName email profileImage")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name status");

    return res.status(201).json(
        new ApiResponse(201, populatedTask, "Task created successfully")
    );
});

// ==================== GET ALL TASKS ====================
export const getAllTasks = asyncHandler(async (req, res) => {
    const { 
        status, 
        projectId, 
        assignedTo,
        priority,
        search,
        page = 1, 
        limit = 10 
    } = req.query;
    
    const query = {};

    // Filter by project if projectId provided
    if (projectId) {
        const project = await Project.findById(projectId);
        if (!project || project.organization.toString() !== req.user.organization.toString()) {
            throw new ApiError(403, "Access denied to this project");
        }
        query.project = projectId;
    } else {
        // If no project specified, get all tasks from user's organization projects
        const projects = await Project.find({ organization: req.user.organization }).select("_id");
        query.project = { $in: projects.map(p => p._id) };
    }

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
        .populate("assignedTo", "firstName lastName email profileImage")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name status")
        .populate({
            path: "comments",
            populate: {
                path: "createdBy",
                select: "firstName lastName profileImage"
            }
        })
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    const totalTasks = await Task.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalTasks,
                totalPages: Math.ceil(totalTasks / parseInt(limit))
            }
        }, "Tasks fetched successfully")
    );
});

// ==================== GET TASK BY ID ====================
export const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id)
        .populate("assignedTo", "firstName lastName email profileImage")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name status organization")
        .populate({
            path: "comments",
            populate: {
                path: "createdBy",
                select: "firstName lastName profileImage"
            }
        })
        .populate("attachments.uploadedBy", "firstName lastName");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access
    const project = await Project.findById(task.project);
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this task");
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task fetched successfully")
    );
});

// ==================== UPDATE TASK ====================
export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access
    const project = await Project.findById(task.project);
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this task");
    }

    // If status is being updated to completed, set completedDate
    if (updates.status === "completed" && task.status !== "completed") {
        updates.completedDate = new Date();
    }

    // If status is being updated to in-progress, set startDate
    if (updates.status === "in-progress" && task.status !== "in-progress") {
        updates.startDate = new Date();
    }

    Object.assign(task, updates);
    await task.save();

    const updatedTask = await Task.findById(id)
        .populate("assignedTo", "firstName lastName email profileImage")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name status");

    return res.status(200).json(
        new ApiResponse(200, updatedTask, "Task updated successfully")
    );
});

// ==================== UPDATE TASK STATUS ====================
export const updateTaskStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, timeSpent } = req.body;

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access
    const project = await Project.findById(task.project);
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this task");
    }

    // Update status and related fields
    task.status = status;
    
    if (timeSpent !== undefined) {
        task.timeSpent = timeSpent;
    }

    if (status === "completed" && task.status !== "completed") {
        task.completedDate = new Date();
    }

    if (status === "in-progress" && task.status !== "in-progress") {
        task.startDate = new Date();
    }

    await task.save();

    return res.status(200).json(
        new ApiResponse(200, task, "Task status updated successfully")
    );
});

// ==================== DELETE TASK ====================
export const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access
    const project = await Project.findById(task.project);
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this task");
    }

    // Delete all comments associated with this task
    await Comment.deleteMany({ task: id });

    // Delete the task
    await task.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );
});

// ==================== ADD COMMENT TO TASK ====================
export const addComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, mentions } = req.body;

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access
    const project = await Project.findById(task.project);
    if (project.organization.toString() !== req.user.organization.toString()) {
        throw new ApiError(403, "Access denied to this task");
    }

    const comment = await Comment.create({
        content,
        task: id,
        createdBy: req.user._id,
        mentions: mentions || []
    });

    // Add comment to task
    task.comments.push(comment._id);
    await task.save();

    const populatedComment = await Comment.findById(comment._id)
        .populate("createdBy", "firstName lastName profileImage")
        .populate("mentions", "firstName lastName email");

    return res.status(201).json(
        new ApiResponse(201, populatedComment, "Comment added successfully")
    );
});

// ==================== UPDATE TASK TIME ====================
export const updateTaskTime = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { timeSpent } = req.body;

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.timeSpent = timeSpent;
    await task.save();

    return res.status(200).json(
        new ApiResponse(200, { timeSpent: task.timeSpent }, "Task time updated successfully")
    );
});

// ==================== ASSIGN TASK ====================
export const assignTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check if user exists and belongs to organization
    const user = await User.findOne({
        _id: userId,
        organization: req.user.organization
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    task.assignedTo = userId;
    await task.save();

    const updatedTask = await Task.findById(id)
        .populate("assignedTo", "firstName lastName email profileImage");

    return res.status(200).json(
        new ApiResponse(200, updatedTask, "Task assigned successfully")
    );
});

// ==================== GET TASKS BY USER ====================
export const getTasksByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.query;

    // Check if user exists and belongs to organization
    const user = await User.findOne({
        _id: userId,
        organization: req.user.organization
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const query = {
        assignedTo: userId,
        project: { $in: await Project.find({ organization: req.user.organization }).select("_id") }
    };

    if (status) query.status = status;

    const tasks = await Task.find(query)
        .populate("project", "name status")
        .populate("assignedBy", "firstName lastName")
        .sort("-createdAt");

    // Group tasks by status
    const tasksByStatus = {
        todo: tasks.filter(t => t.status === "todo"),
        "in-progress": tasks.filter(t => t.status === "in-progress"),
        "in-review": tasks.filter(t => t.status === "in-review"),
        completed: tasks.filter(t => t.status === "completed"),
        blocked: tasks.filter(t => t.status === "blocked")
    };

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === "completed").length,
        inProgress: tasks.filter(t => t.status === "in-progress").length,
        todo: tasks.filter(t => t.status === "todo").length,
        totalTimeSpent: tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0)
    };

    return res.status(200).json(
        new ApiResponse(200, {
            tasks,
            tasksByStatus,
            stats
        }, "User tasks fetched successfully")
    );
});