const fs = require('fs');
const {
  path: { uploads, optimize },
} = require('../config');
const db = require('../db');

const initSetup = async () => {
  try {
    if (!fs.existsSync(uploads)) {
      fs.mkdirSync(uploads);
      if (!fs.existsSync(optimize)) fs.mkdirSync(optimize);
    }

    // await db.createDBTables();
  } catch (err) {
    console.log(`ERROR in initSetup():  ${err.message || err}`);
    throw err;
  }
};

module.exports = initSetup;
