import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";

export const createTask = asyncHandler(async(req, res) => {
    const { title, description, project, assignedTo } = req.body;

    if (!title || !project || !assignedTo) {
        throw new ApiError(400, "Title, project and assignedTo are required");
    }

    const task = await Task.create({
        title,
        description,
        project,
        assignedTo,
        createdBy: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});
export const getAllTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find()
        .populate("project", "name")
        .populate("assignedTo", "firstName lastName email")
        .populate("createdBy", "firstName lastName");

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});