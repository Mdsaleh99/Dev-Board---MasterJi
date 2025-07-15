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

export const getAllProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const allProjects = await Project.find({ createdBy: userId })
    
    if (!allProjects || allProjects.length === 0) {
        throw new ApiError(404, "No projects found")
    }

    res.status(200).json(new ApiResponse(200, allProjects, "all projects fetched successfully"))
})


export const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(403, "id is required")
    }

    const project = await Project.findById(id)
    if (!project) {
        throw new ApiError(404, "project not found")
    }

    res.status(200).json(new ApiResponse(200, project, "project fetched successfully"))
})

export const updateProjectById = asyncHandler(async (req, res) => {
    const { id} = req.params
    if (!id) {
        throw new ApiError(401, "id is required")
    }

    const updateProject = await Project.findByIdAndUpdate(id, req.body, { new: true })
    if (!updateProject) {
        throw new ApiError(401, "project updation failed")
    }

    res.status(201).json(new ApiResponse(201, updateProject, "project updated successfully"))

})

export const deleteProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError(401, "id is required")
    }

    const deleteProject = await Project.findByIdAndDelete(id)
    if (!deleteProject) {
        throw new ApiError(401, "project deletion failed")
    }

    res.status(200).json(new ApiResponse(200, deleteProject, "project deleted successfully"))

})