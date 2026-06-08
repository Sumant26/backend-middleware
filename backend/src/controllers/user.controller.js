import { User } from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import ApiError from "../utils/ApiError.js";
import { signToken } from "../utils/token.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // check if user exists already

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        throw new ApiError(409, "User already exists");
    }

    // create user

    const user = await User.create({
        username,
        email: email.toLowerCase(),
        password,
        loggedIn: false,
    });

    const token = signToken({ id: user._id.toString() });

    res.success({
        user: { id: user._id, email: user.email, username: user.username },
        token,
    }, "User registered", 201);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email.toLowerCase(),
    });

    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await user.comparePasswords(password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    user.loggedIn = true;
    await user.save({ validateBeforeSave: false });

    const token = signToken({ id: user._id.toString() });

    res.success({
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        },
        token,
    }, "User Logged in");
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) throw new ApiError(404, "User not found");

    user.loggedIn = false;
    await user.save({ validateBeforeSave: false });

    res.success(null, "Logout successful");
});

export {
    registerUser,
    loginUser,
    logoutUser
}

