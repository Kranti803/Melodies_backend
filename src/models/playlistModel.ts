import { Schema, Types, model } from "mongoose";
const playlistSchema = new Schema({
  playlistName: { type: String, required: true },
  description: { type: String, required: true },
  songs: {
    type: [Types.ObjectId],
    ref: "Song",
  },
});
const Playlist = model("playlist", playlistSchema);
export default Playlist;
