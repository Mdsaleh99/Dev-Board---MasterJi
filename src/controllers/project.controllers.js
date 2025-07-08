import Project from "../models/project.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const createProject = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const userId = req.user._id

    if (!title || !description) {
        throw new ApiError(401, "All fields are required")
    }

    const exisitingProject = await Project.findOne({ title })
    if (exisitingProject) {
        throw new ApiError(401, "This project already exists")
    }

    const project = await Project.create({
        title,
        description,
        createdBy: userId
    })

    res.status(201).json(new ApiResponse(201, project, "project created successfully"))
})

