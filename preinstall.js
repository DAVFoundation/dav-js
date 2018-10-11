const fs = require('fs');
const path = require('path');

function checkForFiles(err, files) {
    console.log(files.length);
    if ((err===null) && (files.length> 0)) {
        // found files in the directory so we need to empty the directory
        files.forEach(function (file) {
            var filename = path.join('.githooks', file);
            console.log(file);
        });
    }
}

function addGitHooks(err) {
    if (err) {
        console.log(err);
    }
    fs.copyFile('.githooks', '.git/hooks');
}

fs.readdir('.git/hooks', checkForFiles);
//fs.rmdir('.git/hooks', addGitHooks);
