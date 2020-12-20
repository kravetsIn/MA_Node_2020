const crud = require('./crud');
const csv2db = require('./products2db');
const getAllProducts = require('./getAllProducts');

module.exports = {
  ...crud,
  csv2db,
  getAllProducts,
};
