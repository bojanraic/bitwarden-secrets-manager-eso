import zlib from 'node:zlib';

let cache = {
  secret: null,
  project: null,
  projectSecrets: {}
};

function compress(json) {
  return zlib.gzipSync(JSON.stringify(json)).toString('base64');
}

function decompress(compressed) {
  return JSON.parse(zlib.gunzipSync(Buffer.from(compressed, 'base64')).toString());
}


export { cache, compress, decompress };
