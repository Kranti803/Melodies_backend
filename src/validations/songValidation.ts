import { z } from "zod";
import { objectIdSchema } from "./mongoObjectIdValidation";

export const getSingleSongSchema = z.object({
  songId: objectIdSchema,
});

export const increasePlayCountSchema = z.object({
  songId: objectIdSchema,
});
export const updateRecentlyPlayedSchema = z.object({
  songId: objectIdSchema,
  userId: objectIdSchema,
});

export const addAndRemoveFromLikedSchema = z.object({
  songId: objectIdSchema,
});
