import express from "express"
import { validateApikey } from "../middlewares/apiKey.middleware.js"
import { createProject, getAllProjects, getProjectById } from "../controllers/project.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/create", authMiddleware, validateApikey, createProject)
router.get("/get-all", authMiddleware, validateApikey, getAllProjects)
router.get("/:id", authMiddleware, validateApikey, getProjectById)

export default router