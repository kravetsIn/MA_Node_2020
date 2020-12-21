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

    const hasType = await db.getTypeByKeys({ name: type });
    const hasColor = await db.getColorByKeys({ name: color });
    console.log(hasType, hasColor);
    if (hasType && hasColor) {
      const hasTypeId = hasType.id;
      const hasColorId = hasColor.id;
      const product = { ...body, type: hasTypeId, color: hasColorId };

      const createdProduct = await db.createProduct(product);
      res.send({ product: createdProduct });
    } else {
      const err = new Error(`Type or product not created`);
      err.statusCode = 400;
      throw err;
    }
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
      res.send({ message: 'Product not found' });
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

    res.send({ message: `Product deleted` });
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
