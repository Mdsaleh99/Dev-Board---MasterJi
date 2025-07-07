import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import crypto from "crypto"

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
