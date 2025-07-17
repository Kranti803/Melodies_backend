import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { bufferToStream } from "../utils/bufferToStream";

// Uploads a cover image buffer to Cloudinary under the 'covers' folder
export const uploadCoverImageToCloudinary = async (imageBuffer: Buffer) => {
  const imageStream = bufferToStream(imageBuffer);

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "covers",
        },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("No result from Cloudinary"));
          resolve(result);
        }
      );

      imageStream.pipe(cloudinaryStream);
    }
  );

  return uploadResult;
};
