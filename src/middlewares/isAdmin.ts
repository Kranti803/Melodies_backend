import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";
import { IUser } from "../interfaces/userInterface";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  if (user.role !== "admin") {
    return next(new ErrorHandler("Only Admin is allowed here.", 403));
  }
  next();
};

export default isAdmin;
