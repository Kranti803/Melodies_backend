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
import { validate } from "../middlewares/validate";
import {
  addAndRemoveFromLikedSchema,
  getSingleSongSchema,
  increasePlayCountSchema,
  updateRecentlyPlayedSchema,
} from "../validations/songValidation";

const router = express.Router();

//get all songs
router.get("/all", isAuthenticated, getAllSongs);

//get a single song details
router.get(
  "/:songId/playing",
  isAuthenticated,
  validate(getSingleSongSchema, "params"),
  getSingleSong
);

//increase the song played count
router.patch(
  "/:songId/increase_play_count",
  isAuthenticated,
  validate(increasePlayCountSchema, "params"),
  increaseSongPlayedCount
);

//update user's recently played songs
router.put(
  "/:songId/user/:userId/update_recentlyplayed",
  isAuthenticated,
  validate(updateRecentlyPlayedSchema, "params"),
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
  validate(addAndRemoveFromLikedSchema, "params"),
  addAndRemoveFromLiked
);

//get all liked songs
router.patch("/liked", isAuthenticated, getAllLikedSongs);

export default router;
