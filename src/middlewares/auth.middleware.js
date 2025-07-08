import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error"
import User from "../models/user.model.js"


export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token
    
    if (!token) {
        throw new ApiError(401, "Unauthorized token")
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new ApiError(500, "Invalid Token")
    }

    const user = await User.findOne({ _id: decoded._id }).select("-password")
    
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    req.user = user
    next()
})

