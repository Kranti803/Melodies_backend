import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import isAdmin from "../middlewares/isAdmin";
import upload from "../middlewares/audioUpload";
import extractAudioMetaData from "../middlewares/extractAudioMetaData";
import {
  addArtist,
  deleteArtist,
  deleteSong,
  deleteUser,
  uploadSong,
} from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import {
  addArtistSchema,
  deleteArtistSchema,
  deleteSongSchema,
  deleteUserSchema,
} from "../validations/adminValidation";
const router = express.Router();

//create or upload song
router.post(
  "/upload_new_song",
  isAuthenticated,
  isAdmin,
  upload.single("audio"),
  extractAudioMetaData,
  uploadSong
);

//delete songs
router.delete(
  "/:songId/delete",
  isAuthenticated,
  isAdmin,
  validate(deleteSongSchema, "params"),
  deleteSong
);

//delete user
router.delete(
  "/:userId/delete",
  isAuthenticated,
  isAdmin,
  validate(deleteUserSchema, "params"),
  deleteUser
);
//add artist
router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.single("artist"),
  validate(addArtistSchema, "body"),
  addArtist
);
//delete artist
router.delete(
  "/:artistId/delete",
  isAuthenticated,
  isAdmin,
  validate(deleteArtistSchema, "params"),
  deleteArtist
);

export default router;
