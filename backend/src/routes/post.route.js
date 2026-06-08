import { Router } from "express";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.middleware.js";
import { createPostSchema, updatePostSchema } from "../validations/post.validation.js";

const router = Router();

router.route("/create").post(authMiddleware, validateRequest(createPostSchema), createPost);
router.route("/getPosts").get(getPosts);
router.route("/update/:id").patch(authMiddleware, validateObjectId("id"), validateRequest(updatePostSchema), updatePost);
router.route("/delete/:id").delete(authMiddleware, validateObjectId("id"), deletePost);



export default router;
