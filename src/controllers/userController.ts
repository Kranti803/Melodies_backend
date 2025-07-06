// controllers/user.controller.ts
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import User from "./../models/userModel";
import bcrypt from "bcrypt";
import sendToken from "../utils/sendToken";
import crypto from "crypto";
import emailVerification from "../models/emailverifymodel";
import sendEmail from "../utils/sendEmail";

//register user
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return next(new ErrorHandler("All fields are required", 400));

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.provider === "google")
        return next(
          new ErrorHandler(
            "Email is already registered with google. Please continue with google",
            409
          )
        );
      else return next(new ErrorHandler("User already exits", 409));
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    //sending email verification email........
    //generation token first
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //saving hashed token in db
    await emailVerification.create({
      token: hashedToken,
      userId: user._id,
    });

    //sending verification email
    await sendEmail(
      email,
      " Melodies Email Verification",
      "Please verify your email to continue !",
      `<h3><a href="http://localhost:4500/api/user/email_verify/${user._id}/${token}">Click here to verify</a></h3>`
    );
    res.status(200).json({
      success: true,
      message: "Email sent for verification",
    });
  }
);

//send email
export const verifyUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token } = req.params;
    if (!token || !userId)
      return next(new ErrorHandler("Link is invalid", 400));

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const dbToken = await emailVerification.findOne({
      token: hashedToken,
      userId,
    });
    if (!dbToken) return next(new ErrorHandler("Link is expired", 410));

    const user = await User.findById({ _id: userId });
    if (!user) return next(new ErrorHandler("Link is expired", 404));
    user.isVerified = true;
    await user.save();

    sendToken(res, user, "Email Verified successfully");
  }
);

//login user
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("All fields are required", 400));

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid credentials", 401));

    if (!user.isVerified)
      return next(new ErrorHandler("Please verify your email first", 403));

    const isMatched = await bcrypt.compare(password, user.password as string);
    if (!isMatched) return next(new ErrorHandler("Invalid credentials", 401));

    sendToken(res, user, `Welcome ${user.name}`);
  }
);

//logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .clearCookie("jwt_token", {
        expires: new Date(Date.now()),
        httpOnly: true,
        // secure:true, //uncomment when backend and frontend use HTTPS
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User Logged out successfylly",
      });
  }
);

//get user profile
export const getUserProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);
