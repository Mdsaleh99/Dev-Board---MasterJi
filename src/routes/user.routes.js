import express from "express"
import { signup, verifyEmail } from "../controllers/user.controllers.js"

const router = express.Router()

router.post("/signup", signup)
router.get("/verify-email/:token", verifyEmail);

export default router