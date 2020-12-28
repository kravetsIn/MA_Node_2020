const db = require('../../../db');

const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await db.getAllRowsInTable('products');
    res.send({
      products: allProducts,
      message: allProducts.length ? 'ok' : 'products not created',
    });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

module.exports = {
  getAllProducts,
};
