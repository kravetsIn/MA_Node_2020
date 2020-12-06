const auth = require('./auth');
const { errorHandler, notFound } = require('./errorHandle');

module.exports = {
  auth,
  errorHandler,
  notFound,
};
