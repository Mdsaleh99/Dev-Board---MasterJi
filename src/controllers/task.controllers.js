import Task from "../models/task.model.js"
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import Project from "../models/project.model.js";


export const createTask = asyncHandler(async (req, res) => {
    const { title, todo } = req.body
    const { projectId } = req.params
    
    if (!title || !todo || !projectId) {
        throw new ApiError(401, "All fields are required")
    }

    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "project not found")
    }

    const existingTask = await Task.findOne({ title })
    if (existingTask) {
        throw new ApiError(401, "task already exists")
    }

    const task = await Task.create({
        title,
        todo,
        projectId
    })


    res.status(201).json(new ApiResponse(201, task, "task created successfully"))
})

export const getAllTasksByProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    if (!projectId) {
        throw new ApiError(401, "id is required");
    }

    const allTasks = await Task.find({ projectId })
    if (!allTasks || allTasks.length === 0) {
        throw new ApiError(404, "No such task found")
    }

    res.status(200).json(new ApiResponse(200, allTasks, "all tasks fetched successfully"))
})

export const updateTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(401, "id is required");
    }

    const updateTask = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    if (!updateTask) {
        throw new ApiError(401, "task updation failed");
    }

    res.status(201).json(
        new ApiResponse(201, updateTask, "task updated successfully")
    );
});


export const deleteTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(401, "id is required")
    }

    const deleteTask = await Task.findByIdAndDelete(id)
    
    if (!deleteTask) {
        throw new ApiError(401, "task deletion failed")
    }

    res.status(200).json(new ApiResponse(200, deleteTask, "task deleted successfully"))

})

export const getTaskById = asyncHandler(async (req, res) => {
    const { id, projectId } = req.params;

    if (!id || !projectId) {
        throw new ApiError(401, "id is required")
    }

    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "project not found")
    }

    const getTask = await Task.findOne({ _id: id, projectId })
    if (!getTask) {
        throw new ApiError(401, "failed to fetch task")
    }

    res.status(200).json(new ApiResponse(200, getTask, "task fetched successfully"))

})