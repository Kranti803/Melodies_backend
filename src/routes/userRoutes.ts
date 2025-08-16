import express from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/userController";
import isAuthenticated from "../middlewares/isAuthenticated";
import { validate } from "../middlewares/validate";
import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
  verifyUserSchema,
} from "../validations/userValidaton";

const router = express.Router();

//register user
router.post("/register", validate(registerUserSchema), registerUser);

//verify user email
router.get(
  "/email_verify/:userId/:token",
  validate(verifyUserSchema, "params"),
  verifyUser
);

//get profile
router.get("/profile", isAuthenticated, getUserProfile);

//login user
router.post("/login", validate(loginUserSchema), loginUser);

//logout user
router.post("/logout", logoutUser);

//forgot password
router.get("/forgot_password", validate(forgotPasswordSchema), forgotPassword);

//reset password
router.post(
  "/reset_password/:resetToken",
  validate(resetPasswordParamsSchema, "params"),
  validate(resetPasswordBodySchema),
  resetPassword
);

export default router;
