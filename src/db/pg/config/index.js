require('dotenv').config({ path: `${process.env.PWD}/.env` });

const {
  db: {
    config: { pg },
  },
} = require('../../../config');

module.exports = pg;
