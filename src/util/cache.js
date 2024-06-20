import zlib from 'node:zlib';
import { constants } from "../util/constants.js";

let cache = {
  secret: [],
  project: [],
  projectSecrets: {}
};

function compress(json) {
  const jsonString = JSON.stringify(json);
  const uncompressedSize = Buffer.byteLength(jsonString, 'utf8');
  const compressed = zlib.gzipSync(jsonString);
  const compressedSize = compressed.length;
  const compressionSavingsPercentage = ((uncompressedSize - compressedSize) / uncompressedSize) * 100;
  console.log(`${constants.LOG_TAG}: Cache: Original size ${uncompressedSize} bytes, compressed size ${compressedSize} bytes, (${compressionSavingsPercentage.toFixed(2)}% saved)`);
  return compressed.toString('base64');
}

function decompress(compressed) {
  return JSON.parse(zlib.gunzipSync(Buffer.from(compressed, 'base64')).toString());
}


export { cache, compress, decompress };
