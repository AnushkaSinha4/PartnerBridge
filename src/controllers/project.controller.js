import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";

export const createProject = asyncHandler(async(req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Project name is required");
    }

    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

export const getAllProjects = asyncHandler(async(req, res) => {
    const projects = await Project.find()
        .populate("createdBy", "firstName lastName email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});