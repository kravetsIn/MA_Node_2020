require('dotenv').config();

const server = require('./server');
const path = require('./path');
const users = require('./users');

module.exports = {
  server,
  path,
  users,
};
