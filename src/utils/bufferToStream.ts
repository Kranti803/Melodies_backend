import { PassThrough, Readable } from "stream";

export const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new PassThrough();
  stream.end(buffer);
  return stream;
};
