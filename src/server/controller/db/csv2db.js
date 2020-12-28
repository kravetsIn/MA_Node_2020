const {
  serviceDb: { products2db },
} = require('../../../services');

const csv2db = async (req, res, next) => {
  try {
    await products2db(req);
    res.send({ status: 'ok' });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

module.exports = csv2db;
