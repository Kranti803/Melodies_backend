import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { bufferToStream } from "./bufferToStream";

// Uploads a cover image buffer to Cloudinary under the 'covers' folder
export const uploadImageToCloudinary = async (imageBuffer: Buffer,folderName:string) => {
  const imageStream = bufferToStream(imageBuffer);

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder:folderName,
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
