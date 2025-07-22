import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import { uploadSongToCloudinary } from "../utils/uploadSongToCloudinary";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import Song from "../models/songModel";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/userModel";
import Artist from "../models/artistModel";

//upload or create a new song
export const uploadSong = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) return next(new ErrorHandler("File not found", 400));

    // uploading the song to cloudinary
    const uploadedSongResult = await uploadSongToCloudinary(file.buffer);

    // uploading the song cover to cloudinary
    const uploadedSongCoverResult = await uploadImageToCloudinary(
      (req as any)?.audioMetaData?.common?.picture?.[0]?.data,
      "covers"
    );

    const { public_id: song_public_id, secure_url: song_secure_url } =
      uploadedSongResult;
    const { public_id: cover_public_id, secure_url: cover_secure_url } =
      uploadedSongCoverResult;

    const {
      duration,
      common: { title, artists, album, year },
    } = (req as any).audioMetaData;
    await Song.create({
      title,
      image: { public_id: cover_public_id, url: cover_secure_url },
      songUrl: { public_id: song_public_id, url: song_secure_url },
      duration,
      artists,
      year,
      album,
    });

    res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
    });
  }
);

//delete a song
export const deleteSong = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId } = req.params;
    if (!Types.ObjectId.isValid(songId))
      return next(new ErrorHandler("Invalid song id", 400));

    const song = await Song.findById(songId);
    if (!song) return next(new ErrorHandler("Song doesnot exists", 404));

    const { image, songUrl } = song;

    //deleting song and its image from cloudinary

    if (image?.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    if (songUrl?.public_id) {
      await cloudinary.uploader.destroy(songUrl.public_id, {
        resource_type: "video",
      });
    }

    await song.deleteOne();
    res.status(200).json({
      success: true,
      message: "Song deleted successfully",
    });
  }
);

//delete user
export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    if (!Types.ObjectId.isValid(userId))
      return next(new ErrorHandler("Invalid user id", 400));

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("User doesnot exits", 404));

    await user?.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);

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

     await Artist.create({
      name,
      image: { public_id, url: secure_url },
    });
    res.status(200).json({
      success: true,
      message: "Artist added successfully",
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
