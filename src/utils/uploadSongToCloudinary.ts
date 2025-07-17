import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { bufferToStream } from "../utils/bufferToStream";

export const uploadSongToCloudinary = async (fileBuffer: Buffer) => {
  const songStream = bufferToStream(fileBuffer);
  
  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "songs",
        },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("No result from Cloudinary"));
          resolve(result);
        }
      );

      songStream.pipe(cloudinaryStream);
    }
  );
  return uploadResult;
};
