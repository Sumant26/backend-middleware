import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "../validations/user.validation.js";


const router = Router();

router.route("/register").post(validateRequest(registerUserSchema), registerUser);
router.route("/login").post(validateRequest(loginUserSchema), loginUser);
router.route("/logout").post(authMiddleware, logoutUser);



export default router;
