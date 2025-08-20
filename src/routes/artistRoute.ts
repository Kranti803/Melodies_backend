import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import isAdmin from "../middlewares/isAdmin";
import { getAllArtists, getArtistSongs } from "../controllers/artistController";
import { validate } from "../middlewares/validate";
import { getArtistSongsSchema } from "./../validations/artistValidation";
const router = express.Router();

//get all artist
router.get("/all", isAuthenticated, getAllArtists);

//get all songs of a artist
router.get(
  "/:artistId/songs",
  isAuthenticated,
  isAdmin,
  validate(getArtistSongsSchema, "params"),
  getArtistSongs
);

export default router;
