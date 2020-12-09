const fs = require('fs');
const {
  path: { uploads, optimize },
} = require('../config');

const initSetup = () => {
  if (!fs.existsSync(uploads)) {
    fs.mkdirSync(uploads);
    if (!fs.existsSync(optimize)) fs.mkdirSync(optimize);
  }
};

module.exports = initSetup;
