import express from "express"
import { generateApiKey, signin, signout, signup, verifyEmail } from "../controllers/user.controllers.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"


const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.post("/api-key", authMiddleware, generateApiKey)
router.get("/verify-email/:token", verifyEmail);

export default router