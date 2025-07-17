import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import { uploadSongToCloudinary } from "./../utils/uploadSongToCloudinary";
import { uploadCoverImageToCloudinary } from "./../utils/uploadCoverImageToCloudinary";
import Song from "../models/songModel";
import { url } from "inspector";

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
    const song = await Song.create({
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

    if (!songId) return next(new ErrorHandler("Invalid songiId", 400));

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

//get recently played song

//get all artists

//add a playlist

//delete playlist

//add  song  to playlist

//delete song from playlist

//add song to liked

//remove songs from liked
