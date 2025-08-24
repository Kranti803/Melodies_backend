import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import User from "../models/userModel";
import Song from "../models/songModel";
import Playlist from "../models/playlistModel";
import Artist from "../models/artistModel";

//get total songs, total users, total playlists, total artists
export const getDashboardData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();
    const totalArtists = await Artist.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSongs,
        totalPlaylists,
        totalArtists,
      },
    });
  }
);

//get  dshaboard graphs data of total songs uploaded per month
export const getSongsUploadedPerMonth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    const songsUploadedPerMonth = await Song.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: songsUploadedPerMonth,
    });
  }
);

//get  dshaboard graphs data of total user growth per month
export const getUserGrowthPerMonth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userGrowthPerMonth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: userGrowthPerMonth,
    });
  }
);

export const getTopPlayedSongsLastMonth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const latestMonthSong = await Song.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 1 },
    ]);

    if (latestMonthSong.length === 0) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const { year, month } = latestMonthSong[0]._id;

    const top5Songs = await Song.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, year] },
              { $eq: [{ $month: "$createdAt" }, month] },
            ],
          },
        },
      },
      { $sort: { playCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          title: 1,
          playCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: top5Songs,
    });
  }
);
