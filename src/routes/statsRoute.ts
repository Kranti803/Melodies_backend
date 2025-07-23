import express from "express";
import isAuthenticated from "./../middlewares/isAuthenticated";
import isAdmin from "./../middlewares/isAdmin";
import {
  getDashboardData,
  getSongsUploadedPerMonth,
  getTopPlayedSongsLastMonth,
  getUserGrowthPerMonth,
} from "../controllers/statsController";
const router = express.Router();

//get total songs,total artists, total playlits, total users data
router.get("/get_dashboard_data", isAuthenticated, isAdmin, getDashboardData);

//get dashaboard graphs data of total songs uploaded per month
router.get(
  "/songs_uploaded",
  isAuthenticated,
  isAdmin,
  getSongsUploadedPerMonth
);

//get dashaboard graphs data of total user growth per month
router.get("/user_growth", isAuthenticated, isAdmin, getUserGrowthPerMonth);

//get dshaboard graphs data of top 5 most played songs of last month
router.get(
  "/top_played_songs",
  isAuthenticated,
  isAdmin,
  getTopPlayedSongsLastMonth
);
export default router;
