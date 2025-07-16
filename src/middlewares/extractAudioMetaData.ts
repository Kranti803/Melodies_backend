import { parseStream } from "music-metadata";
import { createReadStream } from "fs";
import catchAsyncError from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

const extractAudioMetaData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) return next(new ErrorHandler("No audio file found", 400));

    const audioStream = createReadStream(req?.file?.path as string);

    // Parse the metadata from the stream
    const metadata = await parseStream(audioStream, {
      mimeType: file.mimetype,
    });

    audioStream.close();

    //keeping the audioMetadata for later use
    (req as any).audioMetaData = metadata;

    // Log the parsed metadata
    // console.log(metadata);
    next();
  }
);
export default extractAudioMetaData;
