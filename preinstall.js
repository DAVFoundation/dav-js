const fs = require('fs');
const path = require('path');

const srcDir = '.githooks';
const destDir = '.git/hooks';

function addGitHooks() {
  const srcFiles = fs.readdirSync(srcDir);
  srcFiles.forEach(function (file) {
    var srcFilename = path.join(srcDir, file);
    var DestFilename = path.join(destDir, file);
    fs.copyFileSync(srcFilename, DestFilename);
  });
}

function deleteDirectoryFiles(err, files) {
  if ((err === null) && (files.length > 0)) {
    // found files in the directory so we need to empty the directory
    files.forEach(function (file) {
      var filename = path.join(destDir, file);
      fs.unlinkSync(filename);
    });
  }

  //copy from src
  addGitHooks();
}

// Start by cleaning dest
fs.readdir(destDir, deleteDirectoryFiles);
