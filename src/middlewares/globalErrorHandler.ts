import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

const globalErrorhandler: ErrorRequestHandler = (err, req, res, next) => {
  let message: string | string[] = "Internal Server Error";
  let statusCode = 500;

  if (err instanceof ErrorHandler) {
    message = err.message || "Internal Server Error";
    statusCode = err.statusCode || 500;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    //this will handle something like this :=> throw "something went wrong";
    message = err;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorhandler;
