import express from "express"
import { validateApikey } from "../middlewares/apiKey.middleware.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { deleteTaskById, getTaskById, updateTaskById } from "../controllers/task.controllers.js"

const router = express.Router()

router.put("/:id", authMiddleware, validateApikey, updateTaskById)
router.delete("/:id", authMiddleware, validateApikey, deleteTaskById)
router.get("/:id/:projectId", authMiddleware, validateApikey, getTaskById)

export default router