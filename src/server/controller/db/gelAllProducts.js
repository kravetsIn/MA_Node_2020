const db = require('../../../db');

const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await db.getAllRowsInTable('products');
    if (allProducts) res.send({ products: allProducts });
    else res.send('Products not found');
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

module.exports = getAllProducts;
