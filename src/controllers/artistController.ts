import { Request, Response, NextFunction } from "express";
import catchAsyncError from "./../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import { v2 as cloudinary } from "cloudinary";
import Artist from "../models/artistModel";
import { Types } from "mongoose";
//add artist
export const addArtist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const file = req.file;
    if (!name || !file)
      return next(new ErrorHandler("All filds are required", 404));

    //uploading artist image
    const uploadedResult = await uploadImageToCloudinary(
      file.buffer,
      "artists"
    );
    const { public_id, secure_url } = uploadedResult;

    const artist = await Artist.create({
      name,
      image: { public_id, url: secure_url },
    });
    res.status(200).json({
      success: true,
      message: "Artist added successfully",
    });
  }
);

//get all artists
export const getAllArtists = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const artists = await Artist.find();
    res.status(200).json({
      success: true,
      artists,
    });
  }
);

//delete artist
export const deleteArtist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { artistId } = req.params;
    if (!Types.ObjectId.isValid(artistId))
      return next(new ErrorHandler("Invalid artist Id", 400));

    const artist = await Artist.findByIdAndDelete(artistId);
    if (!artist) return next(new ErrorHandler("Artist not found", 404));

    //deleting the image of artist from cloudinnary as well
    if (artist.image.public_id) {
      await cloudinary.uploader.destroy(artist.image.public_id);
    }
    res.status(200).json({
      success: true,
      message: "Artist deleted successfully",
    });
  }
);
