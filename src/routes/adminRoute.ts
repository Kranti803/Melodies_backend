import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import isAdmin from "../middlewares/isAdmin";
import upload from "../middlewares/audioUpload";
import extractAudioMetaData from "../middlewares/extractAudioMetaData";
import {
  addArtist,
  changeUserRole,
  deleteArtist,
  deleteSong,
  deleteUser,
  getAllUser,
  uploadSong,
} from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import {
  addArtistSchema,
  changeUserRoleSchema,
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

//get all users
router.get("/users", isAuthenticated, isAdmin, getAllUser);

//chnage user role
router.patch(
  "/user/:userId/role",
  isAuthenticated,
  isAdmin,
  validate(changeUserRoleSchema, "params"),
  changeUserRole
);

//delete songs
router.delete(
  "/song/:songId/delete",
  isAuthenticated,
  isAdmin,
  validate(deleteSongSchema, "params"),
  deleteSong
);

//delete user
router.delete(
  "/user/:userId/delete",
  isAuthenticated,
  isAdmin,
  validate(deleteUserSchema, "params"),
  deleteUser
);
//add artist
router.post(
  "/artist/add",
  isAuthenticated,
  isAdmin,
  upload.single("artist"),
  validate(addArtistSchema, "body"),
  addArtist
);
//delete artist
router.delete(
  "/artist/:artistId/delete",
  isAuthenticated,
  isAdmin,
  validate(deleteArtistSchema, "params"),
  deleteArtist
);

export default router;

