import express,{Request,Response} from "express";
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
import isAdmin from "../middlewares/isAdmin";
import extractAudioMetaData from "../middlewares/extractAudioMetaData";
import upload from "../middlewares/audioUpload";

const router = express.Router();

//register user
router.post("/register", registerUser);

//verify user email
router.get("/email_verify/:userId/:token", verifyUser);

//get profile
router.get("/profile", isAuthenticated, isAdmin, getUserProfile);

//login user
router.post("/login", loginUser);

//logout user
router.get("/logout", logoutUser);

//forgot password
router.get("/forgot_password", forgotPassword);

//reset password
router.post("/reset_password/:resetToken", resetPassword);

//testing song upload
router.post(
  "/upload",
  upload.single("audio"),
  extractAudioMetaData,
  (req:Request, res:Response) => {
    console.log("It's working");
    res
      .status(200)
      .json({ message: "Upload successful", metaData: (req as any).audioMetaData });
  }
);

export default router;
