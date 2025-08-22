import { z } from "zod";
import { objectIdSchema } from "./mongoObjectIdValidation";
export const createPlaylistSchem = z.object({
  playlistName: z
    .string()
    .min(5, { message: "Name of playlist should be of minimum 5 characters" })
    .max(15, {
      message: "Name of the playist should not be more that 15 characters",
    })
    .trim(),
  description: z
    .string()
    .min(10, { message: "Name of playlist should be of minimum 10 characters" })
    .max(70, {
      message: "Name of the playist should not be more that 30 characters",
    })
    .trim(),
});

export const addSongToPlaylistSchema = z.object({
  playlistId: objectIdSchema,
  songId: objectIdSchema,
});

export const removeFromPlaylistSchema = z.object({
  playlistId: objectIdSchema,
  songId: objectIdSchema,
});
export const getAllPlaylistSongsSchma = z.object({
  playlistId: objectIdSchema,
});
export const deletePlaylistSchema = z.object({
  playlistId: objectIdSchema,
});
