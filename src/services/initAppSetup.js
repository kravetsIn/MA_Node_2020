const fs = require('fs');
const {
  path: { uploads, optimize },
} = require('../config');
const db = require('../db');

const initSetup = async () => {
  if (!fs.existsSync(uploads)) {
    fs.mkdirSync(uploads);
    if (!fs.existsSync(optimize)) fs.mkdirSync(optimize);
  }
  await db.createProductsTable();
};

module.exports = initSetup;
