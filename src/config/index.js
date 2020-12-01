require('dotenv').config();

const server = require('./server');
const path = require('./path');

module.exports = {
  server,
  path,
};
