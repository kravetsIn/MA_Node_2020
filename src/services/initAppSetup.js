const fs = require('fs');
const {
  path: { uploads, optimize },
} = require('../config');

function initSetup() {
  if (!fs.existsSync(uploads)) {
    fs.mkdirSync(uploads);
    if (!fs.existsSync(optimize)) fs.mkdirSync(optimize);
  }
}

module.exports = initSetup;
