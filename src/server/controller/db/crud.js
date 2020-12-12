const db = require('../../../db');

const createProduct = async (req, res, next) => {
  try {
    const { body } = req;
    const { type, color } = body;

    if (!type) {
      const err = new Error(`No product type defined`);
      err.statusCode = 400;
      throw err;
    }

    if (!color) {
      const err = new Error(`No product color defined`);
      err.statusCode = 400;
      throw err;
    }

    const product = await db.createProduct(body);

    res.send({ id: product.id, product });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const reedProduct = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No product id defined');
      err.statusCode = 400;
      throw err;
    }

    const product = await db.getProduct(id);

    if (!product || (Object.keys(product).length === 0 && product.constructor === Object))
      res.send('Product not found');
    else res.send({ product });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = body;

    if (!id) {
      const err = new Error('No product id defined');
      err.statusCode = 400;
      throw err;
    }

    const product = await db.updateProduct(body);
    res.send({ product });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      const err = new Error('No product id defined');
      err.statusCode = 400;
      throw err;
    }

    await db.deleteProduct(id);

    res.send(`Product deleted`);
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
};

module.exports = {
  createProduct,
  reedProduct,
  updateProduct,
  deleteProduct,
};
