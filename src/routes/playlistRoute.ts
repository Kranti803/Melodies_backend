import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  removeFromPlaylist,
} from "../controllers/playlistController";
const router = express.Router();

//create a playlist
router.post("/create", isAuthenticated, createPlaylist);
//add to playlist
router.patch("/:playlistId/add/:songId", isAuthenticated, addSongToPlaylist);
//remove a song from playlist
router.patch("/:playlistId/add/:songId", isAuthenticated, removeFromPlaylist);
//delete  playlist
router.delete("/:playlistId/add/:songId", isAuthenticated, deletePlaylist);

export default router;
