import express from "express"
import { validateApikey } from "../middlewares/apiKey.middleware.js"
import { createProject, deleteProjectById, getAllProjects, getProjectById, updateProjectById } from "../controllers/project.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { createTask, getAllTasksByProject } from "../controllers/task.controllers.js"

const router = express.Router()

router.post("/create", authMiddleware, validateApikey, createProject)
router.get("/get-all", authMiddleware, validateApikey, getAllProjects)
router.get("/:id", authMiddleware, validateApikey, getProjectById)
router.put("/:id", authMiddleware, validateApikey, updateProjectById)
router.delete("/:id", authMiddleware, validateApikey, deleteProjectById)
router.post("/:projectId/tasks", authMiddleware, validateApikey, createTask);
router.get("/:projectId/tasks", authMiddleware, validateApikey, getAllTasksByProject)

export default router