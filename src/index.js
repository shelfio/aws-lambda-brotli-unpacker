const fs = require('fs');
const path = require('path');
const tar = require('tar-fs');
const zlib = require('zlib');

/**
 * Unpacks brotli archive of a .tar file to /tmp folder
 * @param {String} inputPath Absolute path to the input brotli archive
 * @param {String} outputPath Path to the unpacked binary in /tmp folder
 * @return {Promise<String>} Path to unpacked binary, equals to outputBin
 * @see https://github.com/alixaxel/chrome-aws-lambda
 */
module.exports.unpack = function({inputPath, outputBaseDir, outputPath}) {
  outputBaseDir = outputBaseDir || '/tmp';

  return new Promise((resolve, reject) => {
    let input = path.resolve(inputPath);
    let output = outputPath;

    if (fs.existsSync(output) === true) {
      return resolve(output);
    }

    const source = fs.createReadStream(input);
    const target = tar.extract(outputBaseDir);

    source.on('error', error => {
      return reject(error);
    });

    target.on('error', error => {
      return reject(error);
    });

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
};
