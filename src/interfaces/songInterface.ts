interface ISongUrl {
  public_id: string;
  url: string;
}

interface IImageUrl {
  public_id: string;
  url: string;
}

export interface Isong {
  title: string;
  image: IImageUrl;
  songUrl: ISongUrl;
  duration: number;
  artist: string;
  year: number;
  album: string;
  playCount?: number;
}
