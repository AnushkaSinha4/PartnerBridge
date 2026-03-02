// src/controllers/task.controller.js
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

/* ================= COMMON ORG CHECK ================= */

const checkProjectAccess = async(req, projectId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    if (
        req.user.organization &&
        project.organization &&
        req.user.organization.toString() !== project.organization.toString()
    ) {
        throw new ApiError(403, "Access denied");
    }

    return project;
};

/* ================= CREATE TASK ================= */

export const createTask = asyncHandler(async(req, res) => {
    const { title, description, projectId, assignedTo, priority, dueDate } =
    req.body;

    if (!title || !title.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await checkProjectAccess(req, projectId);

    if (assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            throw new ApiError(400, "Invalid user ID");
        }

        const user = await User.findById(assignedTo);
        if (!user) {
            throw new ApiError(404, "Assigned user not found");
        }
    }

    const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : "",
        project: projectId,
        assignedTo: assignedTo || null,
        assignedBy: req.user._id,
        priority: priority || "medium",
        dueDate: dueDate || null,
        status: "todo",
        organization: project.organization,
    });

    const populatedTask = await Task.findById(task._id)
        .populate("assignedTo", "firstName lastName email")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name");

    return res
        .status(201)
        .json(new ApiResponse(201, populatedTask, "Task created successfully"));
});

/* ================= GET ALL TASKS ================= */

export const getAllTasks = asyncHandler(async(req, res) => {
    const { status, projectId, page = 1, limit = 10 } = req.query;

    const query = {};

    if (projectId) {
        await checkProjectAccess(req, projectId);
        query.project = projectId;
    }

    if (req.user.organization) {
        query.organization = req.user.organization;
    }

    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
        .populate("assignedTo", "firstName lastName email")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    const totalTasks = await Task.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(
            200, {
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalTasks,
                    totalPages: Math.ceil(totalTasks / parseInt(limit)),
                },
            },
            "Tasks fetched successfully"
        )
    );
});

/* ================= UPDATE TASK ================= */

export const updateTask = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) throw new ApiError(404, "Task not found");

    await checkProjectAccess(req, task.project);

    Object.assign(task, req.body);
    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));
});

/* ================= DELETE TASK ================= */

export const deleteTask = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) throw new ApiError(404, "Task not found");

    await checkProjectAccess(req, task.project);

    await Comment.deleteMany({ task: id });
    await task.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

/* ================= ASSIGN TASK ================= */

export const assignTask = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const task = await Task.findById(id);
    if (!task) throw new ApiError(404, "Task not found");

    await checkProjectAccess(req, task.project);

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    task.assignedTo = userId;
    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task assigned successfully"));
});

/* ================= Get Task By Id ================= */

export const getTaskById = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id)
        .populate("assignedTo", "firstName lastName email")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task fetched successfully"));
});

/* ================= Update Task ================= */
export const updateTaskStatus = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.status = status;
    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task status updated successfully"));
});

/* ================= Add Comment ================= */

export const addComment = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const comment = await Comment.create({
        content: content.trim(),
        task: id,
        createdBy: req.user._id,
    });

    task.comments.push(comment._id);
    await task.save();

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"));
});

/* ================= Update Task Time ================= */
export const updateTaskTime = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { timeSpent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    if (timeSpent === undefined || timeSpent < 0) {
        throw new ApiError(400, "Valid timeSpent is required");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.timeSpent = (task.timeSpent || 0) + timeSpent;
    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task time updated successfully"));
});

/* ================= Get Task By User ================= */

export const getTasksByUser = asyncHandler(async(req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tasks = await Task.find({ assignedTo: userId })
        .populate("project", "name")
        .populate("assignedBy", "firstName lastName")
        .sort("-createdAt");

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "User tasks fetched successfully"));
});