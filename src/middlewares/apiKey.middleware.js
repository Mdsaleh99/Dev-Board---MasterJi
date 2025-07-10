import ApiKey from "../models/apiKey.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const validateApikey = asyncHandler(async (req, res, next) => {
    const apiKey = req.headers["x-api-key"]
    if (!apiKey) {
        throw new ApiError(401, "Missing api key")
    }

    const validApikey = await ApiKey.findOne({
        apiKey
    })

    if (!validApikey) {
        throw new ApiError(401, "Invalid api key")
    }

    next()
})