import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import Playlist from "../models/playlistModel";
import ErrorHandler from "../utils/errorHandler";
import Song from "../models/songModel";
import User from "../models/userModel";

//create a playlist
export const createPlaylist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistName, description } = req.body;

    const playlist = await Playlist.create({ playlistName, description });
    const user = await User.findById((req as any).user._id);
    user?.playlists?.push(playlist._id);
    await user?.save();
    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
    });
  }
);

//add  song  to playlist
export const addSongToPlaylist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId, songId } = req.params;

    let playlist = await Playlist.findById(playlistId);
    if (!playlist) return next(new ErrorHandler("Invalid playlist id", 400));
    const song = await Song.findById(songId);
    if (!song) return next(new ErrorHandler("Invalid song id", 400));

    const alreadyAddedSong = playlist?.songs?.find(
      (existingSong) => existingSong._id.toString() === songId
    );
    if (alreadyAddedSong)
      return next(new ErrorHandler("Song already exists in the playlist", 400));

    playlist?.songs?.push(new Types.ObjectId(songId));
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Song added to playlist",
    });
  }
);

//remove a song from playlist
export const removeFromPlaylist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId, songId } = req.params;

    let playlist = await Playlist.findById(playlistId);
    if (!playlist) return next(new ErrorHandler("Invalid playlist id", 400));
    const song = await Song.findById(songId);
    if (!song) return next(new ErrorHandler("Invalid song id", 400));

    const filteredPlaylistSongs = playlist?.songs?.filter(
      (existingSongId) => String(existingSongId) !== songId
    );

    playlist.songs = filteredPlaylistSongs;
    await playlist.save();
  }
);

//get all playlist for admin
export const getAllPlaylist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const playlists = await Playlist.find();

    res.status(200).json({
      success: true,
      playlists: playlists ?? [],
    });
  }
);
//get all playlist for user
export const getAllPlaylistUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "playlists",
      populate: { path: "songs" },
    });
    if (!user) return next(new ErrorHandler("User doesnot exists", 404));

    res.status(200).json({
      success: true,
      playlists: user.playlists ?? [],
    });
  }
);

//get all songs from a playlist
export const getAllPlaylistSongs = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId).populate("songs");
    res.status(200).json({
      success: true,
      playlistSongs: playlist?.songs,
    });
  }
);

//delete playlist
export const deletePlaylist = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { playlistId } = req.params;
    const deletedPlaylist = await Playlist.findOneAndDelete({
      _id: playlistId,
    });
    if (!deletedPlaylist)
      return next(new ErrorHandler("Invalid playlist id", 404));
    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  }
);
