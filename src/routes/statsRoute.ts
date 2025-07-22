import express from "express";
import {
  getDashboardData,
  getSongsUploadedPerMonth,
  getTopPlayedSongsLastMonth,
  getUserGrowthPerMonth,
} from "../controllers/statsController";
const router = express.Router();

//get total songs,total artists, total playlits, total users data
router.get("/get_dashboard_data", getDashboardData);

//get dashaboard graphs data of total songs uploaded per month
router.get("/songs_uploaded", getSongsUploadedPerMonth);

//get dashaboard graphs data of total user growth per month
router.get("/user_growth", getUserGrowthPerMonth);

//get dshaboard graphs data of top 5 most played songs of last month
router.get("/analytics/top-played-songs", getTopPlayedSongsLastMonth);
export default router;
