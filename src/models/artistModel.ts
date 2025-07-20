import { model, Schema, Types } from "mongoose";
import { Iartist } from "../interfaces/artistsInterface";

const artistSchema = new Schema<Iartist>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    url: { type: String, required: true, unique: true },
    public_id: { type: String, required: true, unique: true },
  },
});
const Artist = model<Iartist>("artist", artistSchema);
export default Artist;
