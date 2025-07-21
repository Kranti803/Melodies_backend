import { model, Schema } from "mongoose";
import { Isong } from "../interfaces/songInterface";

const songSchema = new Schema<Isong>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    songUrl: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    duration: {
      type: Number,
      min: 0,
    },
    artists: {
      type: [String],
    },
    year: {
      type: Number,
    },
    album: {
      type: String,
    },
    playCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Song = model<Isong>("Song", songSchema);
export default Song;
