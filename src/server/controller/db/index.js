const crud = require('./crud');
const csv2db = require('./csv2db');
const getAllRows = require('./getAllRows');

module.exports = {
  ...crud,
  ...getAllRows,
  csv2db,
};
