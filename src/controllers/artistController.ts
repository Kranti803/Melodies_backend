import { Request, Response, NextFunction } from "express";
import catchAsyncError from "./../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import Artist from "../models/artistModel";
import { Types } from "mongoose";
import Song from "../models/songModel";

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

//get all songs of a artist
export const getArtistSongs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { artistId } = req.params;

    const artist = await Artist.findById(artistId);
    if (!artist) return next(new ErrorHandler("Artist not found", 404));
    const songs = await Song.find({
      artists: { $regex: new RegExp(`^${artist.name}$`, "i") },
    });
    res.status(200).json({
      success: true,
      songs,
    });
  }
);
