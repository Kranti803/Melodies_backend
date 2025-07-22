import { Types } from "mongoose";

interface IImageUrl {
  public_id: string;
  url: string;
}
export interface Iartist {
  name: string;
  image: IImageUrl;
  relatedSongs?: Types.ObjectId[];
}
