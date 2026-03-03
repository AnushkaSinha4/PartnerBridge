// src/controllers/employee.controller.js
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// ==================== EMPLOYEE DASHBOARD ====================
export const getEmployeeDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const organizationId = req.user.organization;

    console.log("🔍 Fetching employee dashboard for:", userId);

    // Get current date for today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all tasks assigned to this employee
    const tasks = await Task.find({ 
        assignedTo: userId,
        ...(organizationId && { organization: organizationId })
    })
    .populate("project", "name status")
    .populate("assignedBy", "firstName lastName")
    .sort("-createdAt");

    // Task statistics
    const taskStats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === "todo").length,
        inProgress: tasks.filter(t => t.status === "in-progress").length,
        inReview: tasks.filter(t => t.status === "in-review").length,
        completed: tasks.filter(t => t.status === "completed").length,
        blocked: tasks.filter(t => t.status === "blocked").length,
        overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed").length
    };

    // Get high priority tasks
    const highPriorityTasks = tasks
        .filter(t => ["high", "urgent"].includes(t.priority) && t.status !== "completed")
        .slice(0, 5);

    // Get today's tasks (due today)
    const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime() && t.status !== "completed";
    });

    // Get projects where employee is a member
    const projects = await Project.find({
        "members.user": userId,
        ...(organizationId && { organization: organizationId })
    })
    .select("name status dueDate priority")
    .populate("createdBy", "firstName lastName")
    .sort("-createdAt")
    .limit(5);

    // Get project statistics
    const projectStats = {
        total: projects.length,
        active: projects.filter(p => p.status === "active").length,
        completed: projects.filter(p => p.status === "completed").length,
        onHold: projects.filter(p => p.status === "on-hold").length
    };

    // Get recent activities (last 5 tasks updated)
    const recentActivities = tasks
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(task => ({
            id: task._id,
            type: "task",
            action: `Task "${task.title}" was ${task.status}`,
            project: task.project?.name || "Unknown",
            time: task.updatedAt
        }));

    // Get upcoming deadlines (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingDeadlines = tasks
        .filter(t => {
            if (!t.dueDate || t.status === "completed") return false;
            const dueDate = new Date(t.dueDate);
            return dueDate >= today && dueDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
        .map(task => ({
            id: task._id,
            title: task.title,
            project: task.project?.name || "Unknown",
            dueDate: task.dueDate,
            priority: task.priority
        }));

    return res.status(200).json(
        new ApiResponse(200, {
            taskStats,
            projectStats,
            highPriorityTasks,
            todayTasks,
            recentActivities,
            upcomingDeadlines,
            totalTasks: tasks.length,
            totalProjects: projects.length
        }, "Employee dashboard fetched successfully")
    );
});

// ==================== GET MY TASKS (KANBAN DATA) ====================
export const getMyTasks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const organizationId = req.user.organization;
    const { status, priority, projectId, search } = req.query;

    console.log("🔍 Fetching tasks for employee:", userId);

    // Build query
    const query = { 
        assignedTo: userId,
        ...(organizationId && { organization: organizationId })
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId) query.project = projectId;
    
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // Get all tasks
    const tasks = await Task.find(query)
        .populate("project", "name status color")
        .populate("assignedBy", "firstName lastName")
        .populate({
            path: "comments",
            options: { limit: 3, sort: { createdAt: -1 } },
            populate: {
                path: "createdBy",
                select: "firstName lastName profileImage"
            }
        })
        .sort("-createdAt");

    // Group tasks by status for Kanban
    const kanbanData = {
        todo: tasks.filter(t => t.status === "todo"),
        "in-progress": tasks.filter(t => t.status === "in-progress"),
        "in-review": tasks.filter(t => t.status === "in-review"),
        completed: tasks.filter(t => t.status === "completed"),
        blocked: tasks.filter(t => t.status === "blocked")
    };

    // Get task counts by priority
    const priorityCounts = {
        low: tasks.filter(t => t.priority === "low").length,
        medium: tasks.filter(t => t.priority === "medium").length,
        high: tasks.filter(t => t.priority === "high").length,
        urgent: tasks.filter(t => t.priority === "urgent").length
    };

    return res.status(200).json(
        new ApiResponse(200, {
            kanbanData,
            priorityCounts,
            totalTasks: tasks.length
        }, "My tasks fetched successfully")
    );
});

// ==================== UPDATE TASK STATUS (FOR DRAG-DROP) ====================
export const updateMyTaskStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    console.log("🔍 Updating task status:", { id, status });

    // Validate status
    const validStatuses = ["todo", "in-progress", "in-review", "completed", "blocked"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    // Find task and ensure it belongs to this employee
    const task = await Task.findOne({ 
        _id: id, 
        assignedTo: userId 
    });

    if (!task) {
        throw new ApiError(404, "Task not found or not assigned to you");
    }

    // Update status and related fields
    const oldStatus = task.status;
    task.status = status;

    // Set timestamps based on status
    if (status === "in-progress" && oldStatus !== "in-progress") {
        task.startDate = new Date();
    }
    
    if (status === "completed" && oldStatus !== "completed") {
        task.completedDate = new Date();
    }

    await task.save();

    // Populate for response
    await task.populate([
        { path: "project", select: "name" },
        { path: "assignedBy", select: "firstName lastName" }
    ]);

    return res.status(200).json(
        new ApiResponse(200, task, "Task status updated successfully")
    );
});

// ==================== GET MY PROJECTS ====================
export const getMyProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const organizationId = req.user.organization;
    const { status, search, page = 1, limit = 10 } = req.query;

    console.log("🔍 Fetching projects for employee:", userId);

    // Build query
    const query = {
        "members.user": userId,
        ...(organizationId && { organization: organizationId })
    };

    if (status) query.status = status;
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
        .populate("createdBy", "firstName lastName")
        .populate("members.user", "firstName lastName profileImage")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    // Get task counts for each project
    const projectsWithStats = await Promise.all(
        projects.map(async (project) => {
            const tasks = await Task.find({ 
                project: project._id,
                ...(organizationId && { organization: organizationId })
            });
            
            const taskStats = {
                total: tasks.length,
                completed: tasks.filter(t => t.status === "completed").length,
                inProgress: tasks.filter(t => t.status === "in-progress").length,
                todo: tasks.filter(t => t.status === "todo").length
            };

            // Find employee's role in this project
            const memberInfo = project.members.find(
                m => m.user._id.toString() === userId.toString()
            );

            return {
                ...project.toObject(),
                taskStats,
                myRole: memberInfo?.role || "member",
                progress: tasks.length > 0 
                    ? Math.round((taskStats.completed / tasks.length) * 100) 
                    : 0
            };
        })
    );

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
        }, "My projects fetched successfully")
    );
});

// ==================== GET PROJECT DETAILS WITH TASKS ====================
export const getMyProjectDetails = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;
    const organizationId = req.user.organization;

    console.log("🔍 Fetching project details:", projectId);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    // Find project and ensure employee is a member
    const project = await Project.findOne({
        _id: projectId,
        "members.user": userId,
        ...(organizationId && { organization: organizationId })
    })
    .populate("createdBy", "firstName lastName email")
    .populate("members.user", "firstName lastName email profileImage role");

    if (!project) {
        throw new ApiError(404, "Project not found or you don't have access");
    }

    // Get all tasks for this project
    const tasks = await Task.find({ 
        project: projectId,
        ...(organizationId && { organization: organizationId })
    })
    .populate("assignedTo", "firstName lastName profileImage")
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

    // Find my tasks in this project
    const myTasks = tasks.filter(t => 
        t.assignedTo?._id.toString() === userId.toString()
    );

    const response = {
        project,
        tasks: tasksByStatus,
        myTasks: {
            total: myTasks.length,
            completed: myTasks.filter(t => t.status === "completed").length,
            list: myTasks
        },
        teamMembers: project.members,
        taskStats: {
            total: tasks.length,
            completed: tasks.filter(t => t.status === "completed").length,
            inProgress: tasks.filter(t => t.status === "in-progress").length,
            todo: tasks.filter(t => t.status === "todo").length
        }
    };

    return res.status(200).json(
        new ApiResponse(200, response, "Project details fetched successfully")
    );
});

// ==================== UPLOAD DELIVERABLE ====================
export const uploadDeliverable = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const { filename, url } = req.body;
    const userId = req.user._id;
    const organizationId = req.user.organization;

    console.log("🔍 Uploading deliverable:", { projectId, taskId, filename });

    if (!filename || !url) {
        throw new ApiError(400, "Filename and URL are required");
    }

    // Verify project access
    const project = await Project.findOne({
        _id: projectId,
        "members.user": userId,
        ...(organizationId && { organization: organizationId })
    });

    if (!project) {
        throw new ApiError(404, "Project not found or you don't have access");
    }

    let updatedDoc;

    if (taskId) {
        // Upload to specific task
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApiError(400, "Invalid task ID");
        }

        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
            ...(organizationId && { organization: organizationId })
        });

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        task.attachments.push({
            filename,
            url,
            uploadedBy: userId,
            uploadedAt: new Date()
        });

        await task.save();
        updatedDoc = task;
    }

    return res.status(200).json(
        new ApiResponse(200, {
            filename,
            url,
            uploadedAt: new Date(),
            uploadedBy: req.user.firstName + " " + req.user.lastName
        }, "Deliverable uploaded successfully")
    );
});

// ==================== GET MY STATS ====================
export const getMyStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const organizationId = req.user.organization;

    console.log("🔍 Fetching employee stats for:", userId);

    // Get all tasks
    const tasks = await Task.find({ 
        assignedTo: userId,
        ...(organizationId && { organization: organizationId })
    });

    // Get projects count
    const projectsCount = await Project.countDocuments({
        "members.user": userId,
        ...(organizationId && { organization: organizationId })
    });

    // Calculate completion rate
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const completionRate = tasks.length > 0 
        ? Math.round((completedTasks / tasks.length) * 100) 
        : 0;

    // Calculate on-time completion
    const tasksWithDueDate = tasks.filter(t => t.dueDate && t.status === "completed");
    const onTimeTasks = tasksWithDueDate.filter(t => 
        new Date(t.completedDate) <= new Date(t.dueDate)
    ).length;
    
    const onTimeRate = tasksWithDueDate.length > 0
        ? Math.round((onTimeTasks / tasksWithDueDate.length) * 100)
        : 0;

    // Total time spent
    const totalTimeSpent = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);

    // Tasks by priority
    const priorityDistribution = {
        low: tasks.filter(t => t.priority === "low").length,
        medium: tasks.filter(t => t.priority === "medium").length,
        high: tasks.filter(t => t.priority === "high").length,
        urgent: tasks.filter(t => t.priority === "urgent").length
    };

    // Tasks by day (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const tasksOnDay = tasks.filter(t => {
            const createdAt = new Date(t.createdAt);
            return createdAt >= date && createdAt < nextDate;
        });

        last7Days.push({
            date: date.toISOString().split('T')[0],
            count: tasksOnDay.length,
            completed: tasksOnDay.filter(t => t.status === "completed").length
        });
    }

    return res.status(200).json(
        new ApiResponse(200, {
            taskStats: {
                total: tasks.length,
                completed: completedTasks,
                inProgress: tasks.filter(t => t.status === "in-progress").length,
                todo: tasks.filter(t => t.status === "todo").length,
                blocked: tasks.filter(t => t.status === "blocked").length
            },
            performance: {
                completionRate,
                onTimeRate,
                totalTimeSpent,
                projectsCount
            },
            priorityDistribution,
            activityTrend: last7Days
        }, "Employee stats fetched successfully")
    );
});