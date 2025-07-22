import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import isAdmin from "../middlewares/isAdmin";
import {
  addArtist,
  deleteArtist,
  getAllArtists,
} from "../controllers/artistController";
import upload from "../middlewares/audioUpload";
const router = express.Router();

//add artist
router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.single("artist"),
  addArtist
);

//get all artist
router.get("/all", isAuthenticated, isAdmin, getAllArtists);

//delete arttist
router.delete("/:artistId/delete", isAuthenticated, isAdmin, deleteArtist);
export default router;
