import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import isAdmin from "../middlewares/isAdmin";
import { getAllArtists, getArtistSongs } from "../controllers/artistController";
const router = express.Router();

//get all artist
router.get("/all", isAuthenticated, isAdmin, getAllArtists);

//get all songs of a artist
router.get("/:artistId/songs", isAuthenticated, isAdmin, getArtistSongs);

export default router;
