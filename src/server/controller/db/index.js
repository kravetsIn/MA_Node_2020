const crud = require('./crud');
const csv2db = require('./products2db');
const getAllProducts = require('./gelAllProducts');

module.exports = {
  ...crud,
  csv2db,
  getAllProducts,
};
