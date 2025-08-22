import { Schema, Types, model } from "mongoose";
import { Iplaylist } from "../interfaces/playlistInterface";

const playlistSchema = new Schema<Iplaylist>({
  playlistName: { type: String, required: true },
  description: { type: String, required: true },
  songs: {
    type: [Types.ObjectId],
    ref: "Song",
  },
});
const Playlist = model<Iplaylist>("Playlist", playlistSchema);
export default Playlist;
