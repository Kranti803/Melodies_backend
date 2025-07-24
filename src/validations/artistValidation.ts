import { z } from "zod";
import { objectIdSchema } from "./mongoObjectIdValidation";
export const getArtistSongsSchema = z.object({
  artistId: objectIdSchema,
});
