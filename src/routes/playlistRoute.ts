import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylist,
  getAllPlaylistSongs,
  removeFromPlaylist,
} from "../controllers/playlistController";
import { validate } from "../middlewares/validate";
import {
  addSongToPlaylistSchema,
  createPlaylistSchem,
  deletePlaylistSchema,
  getAllPlaylistSongsSchma,
  removeFromPlaylistSchema,
} from "../validations/playlistValidation";
const router = express.Router();

//create a playlist
router.post(
  "/create",
  isAuthenticated,
  validate(createPlaylistSchem, "body"),
  createPlaylist
);
//add to playlist
router.patch(
  "/:playlistId/add/:songId",
  isAuthenticated,
  validate(addSongToPlaylistSchema, "params"),
  addSongToPlaylist
);
//remove a song from playlist
router.patch(
  "/:playlistId/remove/:songId",
  isAuthenticated,
  validate(removeFromPlaylistSchema, "params"),
  removeFromPlaylist
);
//get all playlists
router.get("/all", isAuthenticated, getAllPlaylist);
//get all songs of a playlists
router.get(
  "/:playlistId/songs",
  isAuthenticated,
  validate(getAllPlaylistSongsSchma, "params"),
  getAllPlaylistSongs
);
//delete  playlist
router.delete(
  "/:playlistId/add/:songId",
  isAuthenticated,
  validate(deletePlaylistSchema, "params"),
  deletePlaylist
);

export default router;
