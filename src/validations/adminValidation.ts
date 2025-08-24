import { z } from "zod";
import { objectIdSchema } from "./mongoObjectIdValidation";

export const deleteSongSchema = z.object({
  songId: objectIdSchema,
});
export const deleteUserSchema = z.object({
  userId: objectIdSchema,
});
export const addArtistSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Artist name should be of minimum 5 characters" })
    .max(40, { message: "Artsist name should not be of more than  characters" })
    .trim(),
});
export const deleteArtistSchema = z.object({
  artistId: objectIdSchema,
});
export const changeUserRoleSchema = deleteUserSchema;
