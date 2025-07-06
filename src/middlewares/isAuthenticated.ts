import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import catchAsyncError from "../utils/asyncHandler";
import User from "../models/userModel";
import ErrorHandler from "../utils/errorHandler";

const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const jwt_token: string = req.cookies?.jwt_token;
    if (!jwt_token)
      return next(new ErrorHandler("Please login to get access !", 401));
    const decodedData = (await jwt.verify(
      jwt_token,
      process.env.JWT_SECRET as string
    )) as { _id: string };

    const user = await User.findById({ _id: decodedData._id });
    if (!user) return next(new ErrorHandler("User doesnot exists!", 401));
    req.user = user;
    next();
  }
);

export default isAuthenticated;
