import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type RequestPart = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema<any>, part: RequestPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const errors = result.error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      );
      res.status(400).json({ success: false, errors });
      return;
    }

    // Replacing the original data with the parsed and validated data
    req[part] = result.data;
    next();
  };
