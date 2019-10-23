const fs = require('fs');
const path = require('path');
const tar = require('tar-fs');
const {decompressStream} = require('iltorb');

/**
 * Unpacks brotli archive of a .tar file to /tmp folder
 * @param {Object} args Object containing inputPath and outputPath props
 * @param {string} args.inputPath Absolute path to the input brotli archive
 * @param {string} args.outputPath Path to the unpacked binary in /tmp folder*
 * @return {Promise<string>} Path to unpacked binary, equals to outputBin
 * @see https://github.com/alixaxel/chrome-aws-lambda
 */
module.exports.unpack = function({inputPath, outputPath}) {
  return new Promise((resolve, reject) => {
    let input = path.resolve(inputPath);
    let output = outputPath;

    if (fs.existsSync(output) === true) {
      return resolve(output);
    }

    const source = fs.createReadStream(input);
    const target = tar.extract('/tmp');

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

    source.pipe(decompressStream()).pipe(target);
  });
};
