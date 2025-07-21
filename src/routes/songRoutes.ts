import express from "express";
import {
  addAndRemoveFromLiked,
  getAllSongs,
  getRecentlyPlayed,
  getSingleSong,
  getTrendingSongs,
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
router.get("/all", isAuthenticated, getAllSongs);

//get a single song details
router.get("/:songId/playing", isAuthenticated, getSingleSong);

//increase the song played count
router.patch(
  "/:songId/increase_play_count",
  isAuthenticated,
  increaseSongPlayedCount
);

//update user's recently played songs
router.put(
  "/:songId/user/:userId/update_recentlyplayed",
  isAuthenticated,
  updateRecentlyPlayed
);

//get user's recently played songs
router.get("/recently_played_songs", isAuthenticated, getRecentlyPlayed);

//get trending songs
router.get("/recently_played_songs", isAuthenticated, getTrendingSongs);

//add and remove liked songs
router.patch("/liked/:songId/add_remove", isAuthenticated, addAndRemoveFromLiked);


export default router;
