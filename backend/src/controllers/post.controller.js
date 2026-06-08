import { Post } from "../models/posts.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import ApiError from "../utils/ApiError.js";

// Create a post
const createPost = asyncHandler(async (req, res) => {
    const { name, description, age } = req.body;

    const post = await Post.create({ name, description, age });

    res.success({ post }, "Post created successfully", 201);
});

// Read all posts
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.success({ posts }, "Posts fetched successfully");
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
    // basic validation to check if the body's empty

    // {name: x, description: y, age: z} -> [name, description, age] Object.keys converts {name: x, description: y, age: z} to an array of keys
    // {} = truthy
    if (Object.keys(req.body).length === 0) {
        throw new ApiError(400, "No data provided for update");
    }

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!post) throw new ApiError(404, "Post not found");

    res.success({ post }, "Post updated successfully");
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) throw new ApiError(404, "Post not found");

    res.success(null, "Post successfully deleted");
});
export {
    createPost,
    getPosts,
    updatePost,
    deletePost
};








