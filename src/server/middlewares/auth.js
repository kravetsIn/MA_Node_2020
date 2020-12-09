const basicAuth = require('express-basic-auth');

const { users } = require('../../config');

module.exports = basicAuth({
  users,
});
