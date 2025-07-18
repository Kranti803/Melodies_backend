import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import { uploadSongToCloudinary } from "./../utils/uploadSongToCloudinary";
import { uploadCoverImageToCloudinary } from "./../utils/uploadCoverImageToCloudinary";
import Song from "../models/songModel";
import { url } from "inspector";
import User from "../models/userModel";

//upload/create a new song
export const uploadSong = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) return next(new ErrorHandler("File not found", 400));

    // uploading the song to cloudinary
    const uploadedSongResult = await uploadSongToCloudinary(file.buffer);

    // uploading the song cover to cloudinary
    const uploadedSongCoverResult = await uploadCoverImageToCloudinary(
      (req as any)?.audioMetaData?.common?.picture?.[0]?.data
    );

    const { public_id: song_public_id, secure_url: song_secure_url } =
      uploadedSongResult;
    const { public_id: cover_public_id, secure_url: cover_secure_url } =
      uploadedSongCoverResult;

    const {
      duration,
      common: { title, artist, album, year },
    } = (req as any).audioMetaData;
    await Song.create({
      title,
      image: { public_id: cover_public_id, url: cover_secure_url },
      songUrl: { public_id: song_public_id, url: song_secure_url },
      duration,
      artist,
      year,
      album,
    });

    res.status(200).json({
      success: true,
      message: "Song uploaded successfully",
    });
  }
);

//get all songs
export const getAllSongs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const songs = await Song.find();
    res.status(200).json({
      success: true,
      songs,
    });
  }
);

//get a particular song
export const getSingleSong = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId } = req.params;
    if (!songId) return next(new ErrorHandler("Invalid songId", 404));

    const song = await Song.findById(songId);
    if (!song) return next(new ErrorHandler("This song doesnot exist", 404));

    res.status(200).json({
      success: true,
      song,
    });
  }
);

//increase the songPlayed count
export const increaseSongPlayedCount = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId } = req.params;

    if (!songId) return next(new ErrorHandler("Invalid songId", 400));

    await Song.findByIdAndUpdate(
      songId,
      {
        $inc: { playCount: 1 },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Play count incremented",
    });
  }
);

//get Trending songs

//update recently played song
export const updateRecentlyPlayed = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId, userId } = req.params;

    if (!songId || !userId)
      return next(new ErrorHandler("Invalid songId or userId", 400));

    const user = await User.findById(userId);
    if (!user) return next(new ErrorHandler("Invalid userId", 400));

    const song = await Song.findById(songId);
    if (!song) return next(new ErrorHandler("Invalid songId", 400));

    user.recentlyPlayedSongs = user.recentlyPlayedSongs ?? [];

    //removing duplicates
    user.recentlyPlayedSongs = user.recentlyPlayedSongs.filter(
      (id) => id.toString() !== songId.toString()
    );

    //another way of removing duplicates and adding latest at top
    // const uniqueRecentlyPlayed = new Set(
    //   user.recentlyPlayedSongs.map((id) => id.toString())
    // );
    // uniqueRecentlyPlayed.delete(songId); // Remove current song if exists

    // // Create a new array with the current songId at the front + the rest (unique)
    // user.recentlyPlayedSongs = [
    //   new Types.ObjectId(songId),
    //   ...Array.from(uniqueRecentlyPlayed).map((id) => new Types.ObjectId(id)),
    // ];
    // await user.save();

    //adding to the first index
    user.recentlyPlayedSongs.unshift(song._id);
    //Limit to 5 recent songs
    user.recentlyPlayedSongs.splice(5);

    await user.save();

    const updatedUser = await User.findById(userId).populate(
      "recentlyPlayedSongs"
    );

    res.status(200).json({
      success: true,
      songs: updatedUser?.recentlyPlayedSongs,
    });
  }
);

//get recently played song

//get all artists

//add a playlist

//delete playlist

//add  song  to playlist

//delete song from playlist

//add song to liked

//remove songs from liked
