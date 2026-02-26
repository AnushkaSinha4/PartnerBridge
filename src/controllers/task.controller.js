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
    console.log("User:", req.user?._id);
    console.log("User Organization:", req.user?.organization);

    // Validate required fields
    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project ID format");
    }

    console.log("🔍 Checking Project:", projectId);

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
        console.log("❌ Project NOT FOUND in database!");
        console.log("Searched for ID:", projectId);
        throw new ApiError(404, "Project not found");
    }
    console.log("✅ Project found:", project._id);
    console.log("Project Organization:", project.organization);

    // FIX: Handle organization check safely
    let organizationId = null;
    
    // Get organization from project (priority)
    if (project.organization) {
        organizationId = project.organization;
        console.log("🏢 Using project's organization:", organizationId);
        
        // If user has organization, verify they have access
        if (req.user?.organization) {
            const userOrgId = req.user.organization.toString?.() || req.user.organization;
            const projOrgId = project.organization.toString?.() || project.organization;
            
            if (projOrgId !== userOrgId) {
                console.log("❌ Organization MISMATCH!");
                console.log("Project Org:", projOrgId);
                console.log("User Org:", userOrgId);
                throw new ApiError(403, "Access denied to this project");
            }
            console.log("✅ Organization verified");
        }
    } 
    // If project has no organization, use user's organization
    else if (req.user?.organization) {
        organizationId = req.user.organization;
        console.log("🏢 Using user's organization:", organizationId);
    }
    // If no organization found, try to find default
    else {
        console.log("⚠️ No organization found, looking for default...");
        const Organization = mongoose.model("Organization");
        const defaultOrg = await Organization.findOne({});
        
        if (defaultOrg) {
            organizationId = defaultOrg._id;
            console.log("✅ Using default organization:", organizationId);
        } else {
            // Create default organization
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

    // Check if assigned user exists
    console.log("🔍 Checking User:", assignedTo);
    if (assignedTo) {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            throw new ApiError(400, "Invalid assigned user ID format");
        }

        // Build query for assigned user
        const userQuery = { _id: assignedTo };
        
        // If we have organization, add it to query
        if (organizationId) {
            userQuery.organization = organizationId;
        }

        const assignedUser = await User.findOne(userQuery);
        
        if (!assignedUser) {
            console.log("❌ User NOT FOUND in database!");
            console.log("Searched for ID:", assignedTo);
            console.log("With organization:", organizationId);
            
            // Try without organization filter as fallback
            const fallbackUser = await User.findById(assignedTo);
            if (fallbackUser) {
                console.log("⚠️ User found but without organization filter. Updating user...");
                // Update user with organization
                fallbackUser.organization = organizationId;
                await fallbackUser.save();
                console.log("✅ User organization updated");
            } else {
                throw new ApiError(404, "Assigned user not found");
            }
        } else {
            console.log("✅ User found:", assignedUser._id);
        }
    }

    console.log("🔍 Creating task...");

    // Create task with organization
    const taskData = {
        title: title.trim(),
        description: description?.trim() || "",
        project: projectId,
        assignedTo: assignedTo || null,
        assignedBy: req.user._id,
        priority: priority || "medium",
        dueDate: dueDate || null,
        timeEstimate: timeEstimate || 0,
        tags: tags || [],
        status: "todo"
    };

    // Add organization if available
    if (organizationId) {
        taskData.organization = organizationId;
    }

    const task = await Task.create(taskData);

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

    try {
        // Filter by project if projectId provided
        if (projectId) {
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                throw new ApiError(400, "Invalid project ID format");
            }

            const project = await Project.findById(projectId);
            if (!project) {
                throw new ApiError(404, "Project not found");
            }

            // Check organization access if user has organization
            if (req.user?.organization && project.organization) {
                const userOrgId = req.user.organization.toString?.() || req.user.organization;
                const projOrgId = project.organization.toString?.() || project.organization;
                
                if (projOrgId !== userOrgId) {
                    throw new ApiError(403, "Access denied to this project");
                }
            }
            
            query.project = projectId;
        } else {
            // If no project specified, get all tasks from accessible projects
            let projectQuery = {};
            
            if (req.user?.organization) {
                projectQuery.organization = req.user.organization;
            }
            
            const projects = await Project.find(projectQuery).select("_id");
            query.project = { $in: projects.map(p => p._id) };
        }

        if (status) query.status = status;
        
        if (assignedTo) {
            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                throw new ApiError(400, "Invalid user ID format");
            }
            query.assignedTo = assignedTo;
        }
        
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
    } catch (error) {
        console.error("Error in getAllTasks:", error);
        throw error;
    }
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

    // Check organization access safely
    if (req.user?.organization && task.project) {
        const project = await Project.findById(task.project);
        if (project?.organization) {
            const userOrgId = req.user.organization.toString?.() || req.user.organization;
            const projOrgId = project.organization.toString?.() || project.organization;
            
            if (projOrgId !== userOrgId) {
                throw new ApiError(403, "Access denied to this task");
            }
        }
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task fetched successfully")
    );
});

// ==================== UPDATE TASK ====================
export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access safely
    const project = await Project.findById(task.project);
    if (project?.organization && req.user?.organization) {
        const userOrgId = req.user.organization.toString?.() || req.user.organization;
        const projOrgId = project.organization.toString?.() || project.organization;
        
        if (projOrgId !== userOrgId) {
            throw new ApiError(403, "Access denied to this task");
        }
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access safely
    const project = await Project.findById(task.project);
    if (project?.organization && req.user?.organization) {
        const userOrgId = req.user.organization.toString?.() || req.user.organization;
        const projOrgId = project.organization.toString?.() || project.organization;
        
        if (projOrgId !== userOrgId) {
            throw new ApiError(403, "Access denied to this task");
        }
    }

    // Update status and related fields
    const oldStatus = task.status;
    task.status = status;
    
    if (timeSpent !== undefined) {
        task.timeSpent = (task.timeSpent || 0) + timeSpent;
    }

    if (status === "completed" && oldStatus !== "completed") {
        task.completedDate = new Date();
    }

    if (status === "in-progress" && oldStatus !== "in-progress") {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access safely
    const project = await Project.findById(task.project);
    if (project?.organization && req.user?.organization) {
        const userOrgId = req.user.organization.toString?.() || req.user.organization;
        const projOrgId = project.organization.toString?.() || project.organization;
        
        if (projOrgId !== userOrgId) {
            throw new ApiError(403, "Access denied to this task");
        }
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

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Check organization access safely
    const project = await Project.findById(task.project);
    if (project?.organization && req.user?.organization) {
        const userOrgId = req.user.organization.toString?.() || req.user.organization;
        const projOrgId = project.organization.toString?.() || project.organization;
        
        if (projOrgId !== userOrgId) {
            throw new ApiError(403, "Access denied to this task");
        }
    }

    const comment = await Comment.create({
        content: content.trim(),
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

    return res.status(200).json(
        new ApiResponse(200, { timeSpent: task.timeSpent }, "Task time updated successfully")
    );
});

// ==================== ASSIGN TASK ====================
export const assignTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    console.log("🔍 ASSIGN TASK REQUEST:");
    console.log("Task ID:", id);
    console.log("User ID to assign:", userId);
    console.log("Current User:", req.user?._id);
    console.log("Current User Organization:", req.user?.organization);

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID format");
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Valid user ID is required");
    }

    // Find the task
    const task = await Task.findById(id);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    console.log("✅ Task found:", task._id);

    // Find the project to check organization
    const project = await Project.findById(task.project);
    if (!project) {
        throw new ApiError(404, "Associated project not found");
    }
    console.log("✅ Project found:", project._id);
    console.log("Project Organization:", project.organization);

    // FIX: Get organization from project first, then from user, then default
    let organizationId = null;
    
    // Priority 1: Use project's organization
    if (project.organization) {
        organizationId = project.organization;
        console.log("🏢 Using project's organization:", organizationId);
    } 
    // Priority 2: Use user's organization (if available)
    else if (req.user?.organization) {
        organizationId = req.user.organization;
        console.log("🏢 Using user's organization:", organizationId);
    }
    // Priority 3: Try to find default organization
    else {
        console.log("⚠️ No organization found in project or user, looking for default...");
        const Organization = mongoose.model("Organization");
        const defaultOrg = await Organization.findOne({});
        
        if (defaultOrg) {
            organizationId = defaultOrg._id;
            console.log("✅ Using default organization:", organizationId);
        } else {
            // Create default organization
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

    // Build query for assigned user
    const userQuery = { _id: userId };
    
    // If we have an organization, also check it
    if (organizationId) {
        userQuery.organization = organizationId;
    }

    // Check if user exists
    const user = await User.findOne(userQuery).select("firstName lastName email organization");
    
    if (!user) {
        console.log("❌ User NOT FOUND with query:", userQuery);
        
        // If user not found with organization filter, try without organization filter
        if (organizationId) {
            console.log("⚠️ Trying to find user without organization filter...");
            const userWithoutOrg = await User.findById(userId).select("firstName lastName email organization");
            
            if (userWithoutOrg) {
                console.log("✅ User found but has different organization:", userWithoutOrg.organization);
                
                // Update the user's organization if they don't have one
                if (!userWithoutOrg.organization && organizationId) {
                    console.log("🔄 Updating user with organization...");
                    userWithoutOrg.organization = organizationId;
                    await userWithoutOrg.save();
                    
                    // Use this user now
                    task.assignedTo = userId;
                    await task.save();
                    
                    const updatedTask = await Task.findById(id)
                        .populate("assignedTo", "firstName lastName email profileImage")
                        .populate("assignedBy", "firstName lastName email");
                    
                    return res.status(200).json(
                        new ApiResponse(200, updatedTask, "Task assigned successfully (user organization updated)")
                    );
                } else {
                    throw new ApiError(403, "User belongs to a different organization");
                }
            } else {
                throw new ApiError(404, "User not found");
            }
        } else {
            throw new ApiError(404, "User not found");
        }
    }

    console.log("✅ User found:", user._id);
    console.log("User Organization:", user.organization);

    // Assign the task
    task.assignedTo = userId;
    await task.save();

    // Populate the updated task
    const updatedTask = await Task.findById(id)
        .populate("assignedTo", "firstName lastName email profileImage")
        .populate("assignedBy", "firstName lastName email")
        .populate("project", "name status");

    console.log("✅ Task assigned successfully");

    return res.status(200).json(
        new ApiResponse(200, updatedTask, "Task assigned successfully")
    );
});

// ==================== GET TASKS BY USER ====================
export const getTasksByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Build query for user
    const userQuery = { _id: userId };
    
    // If user has organization, add it to query
    if (req.user?.organization) {
        userQuery.organization = req.user.organization;
    }

    // Check if user exists
    const user = await User.findOne(userQuery);
    if (!user) {
        // Try without organization filter
        const fallbackUser = await User.findById(userId);
        if (!fallbackUser) {
            throw new ApiError(404, "User not found");
        }
        console.log("⚠️ User found but with different organization");
    }

    // Get accessible projects
    let projectQuery = {};
    if (req.user?.organization) {
        projectQuery.organization = req.user.organization;
    }
    
    const projects = await Project.find(projectQuery).select("_id");

    const query = {
        assignedTo: userId,
        project: { $in: projects.map(p => p._id) }
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