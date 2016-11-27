/* eslint-disable */
const fs = require('fs');

const LIB_ROOT = process.argv[2];
const EXPOSE_FILES = process.argv.slice(3);

Promise.all(
  EXPOSE_FILES.map(file =>
    new Promise((res, rej) =>
    fs.writeFile(
      `./${file}.js`,
      `module.exports = require('${LIB_ROOT}/${file}');`,
      err => (err ? rej(err) : res())))
  )
);
