import { User } from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/token.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        throw new ApiError(401, "Authentication token is required");
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
        throw new ApiError(401, "Invalid authentication token");
    }

    req.user = user;
    next();
});

export default authMiddleware;
