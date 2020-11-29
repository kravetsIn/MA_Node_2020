const fs = require('fs');
const {
  path: { uploads },
} = require('../config');

function initSetup() {
  if (!fs.existsSync(uploads)) fs.mkdirSync(uploads);
}

module.exports = initSetup;
