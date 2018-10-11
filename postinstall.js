const fs = require('fs');
const filesToRemove = [
  'node_modules/web3/index.d.ts',
  'node_modules/web3/types.d.ts'
];

filesToRemove.forEach(function (filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});