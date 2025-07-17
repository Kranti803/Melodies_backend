import { parseBuffer } from "music-metadata";
import catchAsyncError from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

const extractAudioMetaData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) return next(new ErrorHandler("No audio file found", 400));

    // Parsing metadata from file(buffer)
    const metadata = await parseBuffer(file.buffer);

    // Attaching the metadat to request object for later use
    (req as any).audioMetaData = metadata;

    next();
  }
);

export default extractAudioMetaData;
