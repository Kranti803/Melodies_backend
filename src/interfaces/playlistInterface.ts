import { Types } from "mongoose";
export interface Iplaylist {
  playlistName: string;
  description: string;
  songs?:Types.ObjectId[];
}
