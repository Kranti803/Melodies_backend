import express from "express";
import {
  getAllSongs,
  getSingleSong,
  increaseSongPlayedCount,
  updateRecentlyPlayed,
  uploadSong,
} from "../controllers/songController";
import isAuthenticated from "./../middlewares/isAuthenticated";
import isAdmin from "./../middlewares/isAdmin";
import extractAudioMetaData from "./../middlewares/extractAudioMetaData";
import upload from "../middlewares/audioUpload";

const router = express.Router();

//upload/create new song
router.post(
  "/upload_new_song",
  isAuthenticated,
  isAdmin,
  upload.single("audio"),
  extractAudioMetaData,
  uploadSong
);

//get all songs
router.get("/all", getAllSongs);

//get a single song details
router.get("/:songId/playing", getSingleSong);

//increase the song played count
router.patch("/:songId/increase_play_count", increaseSongPlayedCount);

//update user's recently played songs
router.put("/:songId/user/:userId/update_recentlyplayed", updateRecentlyPlayed);
export default router;
