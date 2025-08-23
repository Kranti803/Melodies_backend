import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import Song from "../models/songModel";
import User from "../models/userModel";
import { IUser } from "../interfaces/userInterface";
import { Types } from "mongoose";

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

    await Song.findByIdAndUpdate(
      songId,
      {
        $inc: { playCount: 1 },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
    });
  }
);

//update recently played song
export const updateRecentlyPlayed = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId, userId } = req.params;

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
    res.status(200).json({
      success: true,
    });
  }
);

//get recently played song
export const getRecentlyPlayed = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as IUser)._id;
    const user = await User.findById(userId).populate("recentlyPlayedSongs");
    res.status(200).json({
      success: true,
      songs: user?.recentlyPlayedSongs || [],
    });
  }
);

//get Trending songs
export const getTrendingSongs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const trendingSongs = await Song.find().sort({ playCount: -1 }).limit(5); //sorted in desc order;
    res.status(200).json({
      success: true,
      trendingSongs: trendingSongs ?? [],
    });
  }
);

//add and remove  liked song
export const addAndRemoveFromLiked = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { songId } = req.body;

    const song = await Song.findById(songId);
    if (!song) return next(new ErrorHandler("Song does not exist", 404));

    const user = (req as any)?.user;
    const alreadyAdded = user.likedSongs.some(
      (songIdObject: Types.ObjectId) => songIdObject.toString() === songId
    );

    if (alreadyAdded) {
      user.likedSongs = user.likedSongs.filter(
        (songIdObject: Types.ObjectId) => songIdObject.toString() !== songId
      );
      await user.save();
      res.status(200).json({
        success: true,
        message: "Song removed from liked songs",
      });
      return;
    }

    user.likedSongs.push(song._id);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Song added to liked songs",
    });
  }
);

//get all liked songs
export const getAllLikedSongs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).user._id;

    const user = await User.findById(userId).populate("likedSongs");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      likedSongs: user.likedSongs,
    });
  }
);
