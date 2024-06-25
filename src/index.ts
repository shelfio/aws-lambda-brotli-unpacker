import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import tar from 'tar-fs';

type UnpackParams = {inputPath: string; outputBaseDir: string; outputPath: string};

/**
 * Unpacks brotli archive of a .tar file to /tmp folder
 * @param {String} inputPath Absolute path to the input brotli archive
 * @param {String} outputPath Path to the unpacked binary in /tmp folder
 * @return {Promise<String>} Path to unpacked binary, equals to outputBin
 * @see https://github.com/alixaxel/chrome-aws-lambda
 */
export function unpack({inputPath, outputBaseDir, outputPath}: UnpackParams) {
  outputBaseDir = outputBaseDir || '/tmp';

  return new Promise((resolve, reject) => {
    const input = path.resolve(inputPath);
    const output = outputPath;

    if (fs.existsSync(output)) {
      return resolve(output);
    }

    const source = fs.createReadStream(input);
    const target = tar.extract(outputBaseDir);

    source.on('error', error => reject(error));

    target.on('error', error => reject(error));

    target.on('finish', () => {
      fs.chmod(output, '0755', error => {
        if (error) {
          return reject(error);
        }

        return resolve(output);
      });
    });

    source.pipe(zlib.createBrotliDecompress()).pipe(target);
  });
}
