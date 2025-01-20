import fs from 'fs';
import {unpack} from './index.js';

const outputBaseDir = './.test';
const testPackageDir = './etc/test/packages';

it('should unpack test-extract.tar.br package only once', async () => {
  const inputPath = `${testPackageDir}/test-extract.tar.br`;
  const outputPath = `${outputBaseDir}/test-extract/test-file.txt`;
  await unpack({inputPath, outputBaseDir, outputPath});

  const expectedOutputPath = `${outputBaseDir}/test-extract/test-file.txt`;

  expect(fs.existsSync(expectedOutputPath)).toBe(true);
  expect(fs.readFileSync(expectedOutputPath, {encoding: 'utf-8'})).toBe('success\n');

  // Try again with the same output binary but a bogus package. It should ignore the package
  await unpack({
    inputPath: `${outputBaseDir}/does-not-exist`,
    outputBaseDir,
    outputPath,
  });

  expect(fs.existsSync(expectedOutputPath)).toBe(true);
  expect(fs.readFileSync(expectedOutputPath, {encoding: 'utf-8'})).toBe('success\n');
});
