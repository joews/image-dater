"use strict";

const fs = require("fs");
const path = require("path");

const exif = require("exiftool");
const denodeify = require("denodeify");
const co = require("co");
const parallel = require("co-parallel");

const readExif = denodeify(exif.metadata); 
const readFile = denodeify(fs.readFile);
const rename = denodeify(fs.rename);

const files = process.argv.slice(2);
const LIMIT = 100;

const numTasks = files.length;
let numCompleted = 0;

function getNewFilePath(filePath, exifMetadata) {
  const oldFileName = path.basename(filePath);
  const dir = path.dirname(filePath);

  const inputDateTime = exifMetadata["date/timeOriginal"];
  const inputTimeChunks = inputDateTime.split(/[ \.]/);

  const date = inputTimeChunks[0].replace(/:/g, '-');
  const time = inputTimeChunks[1].replace(/\//g, ':');

  const newFileName = `${date}_${time}_${oldFileName}`;
  return path.join(dir, newFileName);
}

function *renameFile(filePath) {
  const fileData = yield readFile(filePath);
  const metadata = yield readExif(fileData);
  const newFilePath = getNewFilePath(filePath, metadata);
  yield rename(filePath, newFilePath);
  
  return newFilePath;
}

// Run
co(function* () {
  const renamedFilePaths = files.map(renameFile);
  return yield parallel(renamedFilePaths, LIMIT);
})
.then(d => { console.log(d) })
.catch(e => { console.error(e) })


