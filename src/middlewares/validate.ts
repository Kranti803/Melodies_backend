import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

type RequestPart = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema<any>, part: RequestPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
       return next(new ErrorHandler(errors.join(), 400));
    }

    // Replacing the original data with the parsed and validated data
    req[part] = result.data;
    next();
  };
