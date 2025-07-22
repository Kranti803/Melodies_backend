import express from "express";
import {
  addAndRemoveFromLiked,
  getAllLikedSongs,
  getAllSongs,
  getRecentlyPlayed,
  getSingleSong,
  getTrendingSongs,
  increaseSongPlayedCount,
  updateRecentlyPlayed,
} from "../controllers/songController";
import isAuthenticated from "./../middlewares/isAuthenticated";

const router = express.Router();

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
router.patch(
  "/liked/:songId/add_remove",
  isAuthenticated,
  addAndRemoveFromLiked
);

//add and remove liked songs
router.patch("/liked", isAuthenticated, getAllLikedSongs);

export default router;
