const {unpack} = require('./src/index');
const path = require('path');
const {readdirSync} = require('fs');
const {execSync} = require('child_process');

const inputPath = path.join(__dirname, 'bin', 'tt.tar.br'); // example possible input path
const outputPath = '/tmp/instdir';

module.exports.handler = async () => {
  await unpack({inputPath, outputPath});
  readdirSync(outputPath).forEach(file => console.log(file));
  execSync(`ls -al ${outputPath} `);
};
