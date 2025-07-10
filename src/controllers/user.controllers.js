import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import ApiKey from "../models/apiKey.model.js"

export const signup = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body
    
    if (!email || !name || !password) {
        throw new ApiError(401, "All fields are required")
    }

    const existing = await User.findOne({ email })
    if (existing) {
        throw new ApiError(401, "User with this email already exists")
    }

    const user = await User.create({
        email,
        name,
        password
    })

    if (!user) {
        throw new ApiError(403, "Failed to signup user")
    }

    const emailVerificationToken = user.generateEmailVerificationToken()
    await user.save()

    const emailVerificationUrl = `http://localhost:8000/api/v1/auth/verify-email/${emailVerificationToken}`

    await sendEmail({
        email: user.email,
        subject: "Verify your email address",
        mailgenContent: emailVerificationMailgenContent(
            user.name,
            emailVerificationUrl
        )
    })


    res.status(201).json(new ApiResponse(201, user, "user signup successfully"))
})


export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params
    if (!token) {
        throw new ApiError(400, "Token is rquired to verify email")
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        $and: [
            { emailVerificationToken: hashedToken },
            {emailVerificationExpiry: {$gt: Date.now()}}
        ]
    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired token")
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined

    await user.save()

    res.status(200).json(new ApiResponse(200, null, "User verified successfully"))

})

export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(401, "All fields are required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const isMatch = user.isPasswordCorrect(password)
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password")
    }

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    }

    const token = jwt.sign({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '24h' })
    

    res.status(201).cookie("token", token, cookieOptions).json(new ApiResponse(201, user, "user signin successfully"))
})

export const signout = asyncHandler(async (req, res) => {
    res.status(200).clearCookie("token").json(new ApiResponse(200, null, "user signout successfully"))
})

export const generateApiKey = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const genApiKey = crypto.randomBytes(32).toString("hex")

    const apiKey = await ApiKey.create({
        userId,
        apiKey: genApiKey
    })

    if (!apiKey) {
        throw new ApiError(401, "failed to generate api key")
    }

    res.status(201).json(new ApiResponse(201, apiKey, "api key generated successfully"))
})